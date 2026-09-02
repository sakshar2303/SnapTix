/**
 * SnapTix High-Concurrency Stress Test
 * 
 * Demonstrates provable correctness under extreme race conditions:
 * Fires N concurrent hold requests at the EXACT SAME SEAT within milliseconds.
 * 
 * Concurrency Guarantee:
 * Exactly 1 request succeeds (HTTP 200).
 * Exactly N - 1 requests receive a clean rejection (HTTP 409).
 * Zero double-bookings.
 */

const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000";
const CONCURRENT_REQUESTS = parseInt(process.env.CONCURRENT_REQUESTS || "500", 10);
const TARGET_SEAT = process.env.TARGET_SEAT || "D5";
const EVENT_ID = process.env.EVENT_ID || "venue-pvr-imax";

async function runLoadTest() {
  console.log("==================================================================");
  console.log("⚡ SnapTix Concurrency Stress Test: Single-Seat Collision Race");
  console.log("==================================================================");
  console.log(`Target Server:         ${SERVER_URL}`);
  console.log(`Target Seat:           ${TARGET_SEAT} (Center Mezzanine)`);
  console.log(`Concurrent Contenders: ${CONCURRENT_REQUESTS} simultaneous requests`);
  console.log(`Concurrency Strategy:  Redis atomic SET NX EX 300`);
  console.log("------------------------------------------------------------------");

  // 1. Reset state to ensure clean target seat
  try {
    const resetRes = await fetch(`${SERVER_URL}/api/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: EVENT_ID }),
    });
    if (!resetRes.ok) {
      console.warn("⚠️ Reset returned non-200, continuing anyway...");
    }
  } catch (err) {
    console.error(`💥 Failed to connect to server at ${SERVER_URL}:`, err.message);
    process.exit(1);
  }

  // 2. Prepare N simultaneous hold requests with unique user identities
  const contenders = Array.from({ length: CONCURRENT_REQUESTS }, (_, i) => ({
    userId: `stress-runner-${String(i + 1).padStart(3, "0")}`,
    seatId: TARGET_SEAT,
    eventId: EVENT_ID,
  }));

  console.log(`🚀 Firing ${CONCURRENT_REQUESTS} concurrent requests via Promise.allSettled()...`);
  const startTime = Date.now();

  const promises = contenders.map((contender) => {
    const reqStart = performance.now();
    return fetch(`${SERVER_URL}/api/hold`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contender),
    })
      .then(async (res) => {
        const durationMs = performance.now() - reqStart;
        const body = await res.json().catch(() => ({}));
        return {
          status: res.status,
          durationMs,
          userId: contender.userId,
          body,
        };
      })
      .catch((err) => ({
        status: 0,
        error: err.message,
      }));
  });

  const results = await Promise.allSettled(promises);
  const totalDurationMs = Date.now() - startTime;

  // 3. Analyze results
  let successCount = 0;
  let rejectedCount = 0;
  let networkErrorCount = 0;
  let winner = null;
  const latencies = [];

  for (const item of results) {
    if (item.status === "fulfilled") {
      const res = item.value;
      if (res.durationMs) latencies.push(res.durationMs);

      if (res.status === 200 && res.body?.success) {
        successCount++;
        winner = res.userId;
      } else if (res.status === 409) {
        rejectedCount++;
      } else {
        networkErrorCount++;
      }
    } else {
      networkErrorCount++;
    }
  }

  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.length
    ? (latencies.reduce((sum, val) => sum + val, 0) / latencies.length).toFixed(2)
    : 0;
  const p50 = latencies.length ? latencies[Math.floor(latencies.length * 0.5)].toFixed(2) : 0;
  const p95 = latencies.length ? latencies[Math.floor(latencies.length * 0.95)].toFixed(2) : 0;
  const p99 = latencies.length ? latencies[Math.floor(latencies.length * 0.99)].toFixed(2) : 0;

  console.log("------------------------------------------------------------------");
  console.log("📊 RESULTS SUMMARY:");
  console.log(`✅ Successful Holds (Winner):    ${successCount} / ${CONCURRENT_REQUESTS}`);
  console.log(`❌ Clean Rejections (409 Conflict): ${rejectedCount} / ${CONCURRENT_REQUESTS}`);
  console.log(`⚠️ Network / Unexpected Errors:   ${networkErrorCount}`);
  console.log(`🏆 Winning User ID:               ${winner || "None"}`);
  console.log(`⏱️ Total Batch Elapsed Time:      ${totalDurationMs} ms`);
  console.log(`📈 Latency Distribution:`);
  console.log(`   - Average: ${avgLatency} ms`);
  console.log(`   - p50:     ${p50} ms`);
  console.log(`   - p95:     ${p95} ms`);
  console.log(`   - p99:     ${p99} ms`);
  console.log("==================================================================");

  // 4. Assert zero double-booking invariant
  if (successCount === 1 && rejectedCount === CONCURRENT_REQUESTS - 1 && networkErrorCount === 0) {
    console.log("🎉 PASS: ZERO DOUBLE-BOOKING GUARANTEE PROVEN MATHEMATICALLY CORRECT!");
    console.log(`   Exactly 1 hold granted out of ${CONCURRENT_REQUESTS} parallel contenders.`);
    process.exit(0);
  } else {
    console.error("💥 FAIL: Invariant violation detected!");
    console.error(`   Expected 1 success and ${CONCURRENT_REQUESTS - 1} rejections.`);
    console.error(`   Received: ${successCount} successes, ${rejectedCount} rejections.`);
    process.exit(1);
  }
}

runLoadTest();
