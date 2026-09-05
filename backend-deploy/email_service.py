"""Email service using Resend for transactional emails."""
import resend
from config import settings

resend.api_key = settings.RESEND_API_KEY

FROM_ADDRESS = settings.EMAIL_FROM


def send_verification_email(to: str, token: str) -> dict:
    """Send email verification link. Returns Resend API response."""
    if not settings.RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY not configured")

    verify_url = f"{settings.FRONTEND_BASE_URL}/verify-email/?token={token}"

    subject = "Verify your Ashwatthama account"
    html = f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify your email</title></head>
<body style="font-family: system-ui, sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; border: 1px solid #333; background: #141414; padding: 32px;">
    <p style="color: #e0723a; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px;">▲ Ashwatthama</p>
    <h1 style="font-weight: 300; font-size: 22px; color: #f3f0eb; margin: 0 0 16px 0;">Verify your email address</h1>
    <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Click the button below to confirm your email and activate your account.
      This link expires in 24 hours.
    </p>
    <a href="{verify_url}" style="display: inline-block; background: #e0723a; color: #0a0a0a; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
      Verify Email
    </a>
    <p style="color: #666; font-size: 11px; margin-top: 24px; word-break: break-all;">
      Or paste this URL: {verify_url}
    </p>
    <p style="color: #444; font-size: 11px; margin-top: 16px;">
      If you did not create an account, ignore this email.
    </p>
  </div>
</body>
</html>"""

    return resend.Emails.send({
        "from": FROM_ADDRESS,
        "to": to,
        "subject": subject,
        "html": html,
    })


def send_password_reset_email(to: str, token: str) -> dict:
    """Send password reset link. Returns Resend API response."""
    if not settings.RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY not configured")

    reset_url = f"{settings.FRONTEND_BASE_URL}/reset-password/?token={token}"

    subject = "Reset your Ashwatthama password"
    html = f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reset your password</title></head>
<body style="font-family: system-ui, sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; border: 1px solid #333; background: #141414; padding: 32px;">
    <p style="color: #e0723a; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px;">▲ Ashwatthama</p>
    <h1 style="font-weight: 300; font-size: 22px; color: #f3f0eb; margin: 0 0 16px 0;">Reset your password</h1>
    <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Click the button below to set a new password. This link expires in 1 hour
      and can only be used once.
    </p>
    <a href="{reset_url}" style="display: inline-block; background: #e0723a; color: #0a0a0a; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
      Reset Password
    </a>
    <p style="color: #666; font-size: 11px; margin-top: 24px; word-break: break-all;">
      Or paste this URL: {reset_url}
    </p>
    <p style="color: #444; font-size: 11px; margin-top: 16px;">
      If you did not request this, ignore this email — your password will not change.
    </p>
  </div>
</body>
</html>"""

    return resend.Emails.send({
        "from": FROM_ADDRESS,
        "to": to,
        "subject": subject,
        "html": html,
    })
