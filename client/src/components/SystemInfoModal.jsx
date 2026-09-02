"use client";

import React from "react";
import { ShieldCheck, Server, Database, Zap, Cpu, X, CheckCircle2 } from "lucide-react";

export default function SystemInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">System Concurrency & Correctness Proof</h3>
            <p className="text-xs text-slate-400">Why zero double-bookings occur even under millisecond collisions</p>
          </div>
        </div>

        {/* 1. The Locking Primitive */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-indigo-300">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>1. Atomic Locking Primitive: Redis SET NX EX</span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            When a user clicks a seat, the server invokes:
          </p>
          <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto">
            SET seat:&#123;eventId&#125;:&#123;seatId&#125; &#123;userId&#125; NX EX 300
          </div>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>NX (Not Exists):</strong> Only sets key if it doesn't already exist. Redis executes commands sequentially on a single-threaded event loop per key. There is zero interleaved window where two commands can both see &ldquo;unclaimed&rdquo;.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>EX 300 (Auto TTL):</strong> Key auto-expires in 300s (5 min). Guarantees zero zombie holds without requiring fragile cron sweepers.
              </span>
            </li>
          </ul>
        </div>

        {/* 2. Scalability Architecture */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-sky-300">
            <Server className="w-4 h-4 text-sky-400" />
            <span>2. Multi-Instance Scalability (No Single Point of Failure)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The lock state does not reside in Node.js process memory. It lives in Redis. Even with 10 Node.js servers behind a Round-Robin Load Balancer, all instances coordinate through the same external atomic Redis layer. Paired with <strong>@socket.io/redis-adapter</strong>, broadcasts emitted on Instance A reach clients connected to Instance B seamlessly.
          </p>
        </div>

        {/* 3. Durable Ledger & Expiration */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-emerald-300">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>3. Durable System of Record & Keyspace Expiration</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Finalized checkouts write to Postgres inside an ACID transaction with a database-level <code>UNIQUE(event_id, seat_id)</code> constraint as a secondary physical invariant. On hold expiration, Redis keyspace notifications (<code>__keyevent@*__:expired</code>) broadcast <code>seat_released</code> immediately.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
        >
          Close Documentation
        </button>
      </div>
    </div>
  );
}
