"""In-memory rate limiter with per-key tracking."""
import time
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Dict


@dataclass
class RateLimitEntry:
    count: int = 0
    window_start: float = field(default_factory=time.time)


class RateLimiter:
    """
    Simple in-memory rate limiter.
    Tracks requests per key (IP, device, user) within time windows.
    """

    _CLEANUP_EVERY_N_CALLS = 500
    _CLEANUP_MAX_AGE_SECONDS = 600

    def __init__(self):
        self._entries: Dict[str, RateLimitEntry] = defaultdict(RateLimitEntry)
        self._default_max = 60
        self._default_window = 60.0
        self._calls_since_cleanup = 0

    def check_limit(
        self,
        key: str,
        max_requests: int = None,
        window_seconds: float = None,
    ) -> tuple:
        """
        Check if request is within rate limit.

        Returns:
            (allowed: bool, remaining: int, reset_at: float)
        """
        max_requests = max_requests or self._default_max
        window_seconds = window_seconds or self._default_window
        now = time.time()

        # Self-clean periodically so long-lived processes don't leak memory
        # from an ever-growing dict of stale per-key entries.
        self._calls_since_cleanup += 1
        if self._calls_since_cleanup >= self._CLEANUP_EVERY_N_CALLS:
            self._calls_since_cleanup = 0
            self.cleanup(self._CLEANUP_MAX_AGE_SECONDS)

        entry = self._entries[key]

        # Reset if window expired
        if now - entry.window_start > window_seconds:
            entry.count = 0
            entry.window_start = now

        entry.count += 1
        remaining = max(0, max_requests - entry.count)
        reset_at = entry.window_start + window_seconds
        allowed = entry.count <= max_requests

        return allowed, remaining, reset_at

    def is_allowed(self, key: str, max_requests: int = None, window_seconds: float = None) -> bool:
        """Quick check — just returns True/False."""
        allowed, _, _ = self.check_limit(key, max_requests, window_seconds)
        return allowed

    def reset(self, key: str):
        """Reset limit for a specific key."""
        if key in self._entries:
            del self._entries[key]

    def cleanup(self, max_age_seconds: float = 300):
        """Remove expired entries."""
        now = time.time()
        expired = [k for k, v in self._entries.items() if now - v.window_start > max_age_seconds]
        for k in expired:
            del self._entries[k]
