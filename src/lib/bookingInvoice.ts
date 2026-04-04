import { Booking } from "@/types";
import {
  formatDateTime,
  formatDuration,
  formatPrice,
  getPaymentStatusLabel,
  getStatusLabel,
} from "@/lib/utils";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildOptionalRow = (label: string, value?: string | null): string => {
  if (!value) {
    return "";
  }

  return `
    <div class="detail-row">
      <span class="detail-label">${escapeHtml(label)}</span>
      <span class="detail-value">${escapeHtml(value)}</span>
    </div>
  `;
};

export function printBookingInvoice(booking: Booking): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const printWindow = window.open(
    "",
    `booking-invoice-${booking.trackingNumber}`,
    "width=980,height=760",
  );

  if (!printWindow) {
    return false;
  }

  const scheduledHours =
    (new Date(booking.bookedEndTime).getTime() -
      new Date(booking.bookedStartTime).getTime()) /
    (1000 * 60 * 60);
  const statusLabel = booking.statusLabel ?? getStatusLabel(booking.status);
  const paymentStatusLabel = getPaymentStatusLabel(booking.paymentStatus);
  const invoiceDate = formatDateTime(new Date());
  const currentTotalPrice = booking.currentTotalPrice ?? booking.totalPrice;
  const overtimeHours =
    booking.lateChargeMode === "pending"
      ? booking.uptimeHours ?? 0
      : booking.overtimeHours ?? 0;
  const overtimePrice =
    booking.lateChargeMode === "pending"
      ? booking.uptimePrice ?? 0
      : booking.overtimePrice ?? 0;
  const overtimeLabel =
    booking.lateChargeMode === "pending"
      ? "Estimated late pick-up charge"
      : "Late pick-up charge";

  const notes: string[] = [];

  if (booking.discountPercent > 0) {
    notes.push(
      `${booking.discountPercent}% booking discount was applied to the prepaid amount.`,
    );
  }

  if (booking.lateChargeMode === "pending" && overtimePrice > 0) {
    notes.push(
      "Late pick-up charges are still estimated and should be collected manually at pickup.",
    );
  } else if (booking.overtimePrice > 0) {
    notes.push("Late pick-up charges were added after the actual pickup time.");
  }

  if (booking.paymentStatus !== "paid") {
    notes.push("Payment has not been confirmed yet.");
  }

  const noteMarkup = notes.length
    ? notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")
    : "<li>No additional notes.</li>";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(booking.trackingNumber)}</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Segoe UI", Arial, sans-serif;
        background: #eef2f7;
        color: #0f172a;
      }

      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 32px 20px 40px;
      }

      .invoice {
        background: #ffffff;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
      }

      .header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 32px;
        background:
          radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 32%),
          linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
        color: #ffffff;
      }

      .brand {
        max-width: 360px;
      }

      .brand h1 {
        margin: 0 0 8px;
        font-size: 32px;
        letter-spacing: 0.03em;
      }

      .brand p {
        margin: 0;
        color: rgba(255, 255, 255, 0.82);
        line-height: 1.55;
      }

      .meta {
        min-width: 240px;
        padding: 18px 20px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(10px);
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 6px 0;
        font-size: 14px;
      }

      .meta-label {
        color: rgba(255, 255, 255, 0.7);
      }

      .meta-value {
        font-weight: 700;
        text-align: right;
      }

      .body {
        padding: 32px;
      }

      .badges {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 24px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .badge.status {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .badge.payment-paid {
        background: #dcfce7;
        color: #166534;
      }

      .badge.payment-awaiting {
        background: #fef3c7;
        color: #92400e;
      }

      .sections {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .card {
        border: 1px solid #dbe3ef;
        border-radius: 20px;
        padding: 22px;
        background: #f8fafc;
      }

      .card h2 {
        margin: 0 0 18px;
        font-size: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #475569;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 9px 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .detail-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .detail-label {
        color: #64748b;
      }

      .detail-value {
        font-weight: 600;
        text-align: right;
      }

      .totals {
        margin-top: 24px;
        border-radius: 24px;
        padding: 24px;
        background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
        border: 1px solid #bfdbfe;
      }

      .line-item {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(148, 163, 184, 0.3);
      }

      .line-item:last-of-type {
        border-bottom: none;
      }

      .line-item span:last-child {
        font-weight: 700;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        margin-top: 16px;
        padding-top: 18px;
        border-top: 1px solid rgba(59, 130, 246, 0.25);
        font-size: 20px;
        font-weight: 800;
      }

      .notes {
        margin-top: 24px;
        border-radius: 20px;
        padding: 20px 22px;
        background: #fff7ed;
        border: 1px solid #fdba74;
      }

      .notes h2 {
        margin: 0 0 12px;
        font-size: 14px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9a3412;
      }

      .notes ul {
        margin: 0;
        padding-left: 18px;
        color: #7c2d12;
      }

      .notes li + li {
        margin-top: 8px;
      }

      .footer {
        margin-top: 28px;
        font-size: 12px;
        text-align: center;
        color: #64748b;
      }

      @media print {
        body {
          background: #ffffff;
        }

        .page {
          padding: 0;
          max-width: none;
        }

        .invoice {
          box-shadow: none;
          border-radius: 0;
        }
      }

      @media (max-width: 720px) {
        .header,
        .sections {
          grid-template-columns: 1fr;
          display: grid;
        }

        .header {
          padding: 24px;
        }

        .body {
          padding: 24px;
        }
      }
    </style>
    <script>
      window.addEventListener("load", function () {
        window.focus();
        window.print();
      });
    </script>
  </head>
  <body>
    <div class="page">
      <div class="invoice">
        <div class="header">
          <div class="brand">
            <h1>ParkPro</h1>
            <p>Booking invoice for airport parking reservations and pickup charges.</p>
          </div>
          <div class="meta">
            <div class="meta-row">
              <span class="meta-label">Invoice Date</span>
              <span class="meta-value">${escapeHtml(invoiceDate)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Tracking Number</span>
              <span class="meta-value">${escapeHtml(booking.trackingNumber)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Customer</span>
              <span class="meta-value">${escapeHtml(booking.userName)}</span>
            </div>
          </div>
        </div>

        <div class="body">
          <div class="badges">
            <span class="badge status">${escapeHtml(statusLabel)}</span>
            <span class="badge ${
              booking.paymentStatus === "paid"
                ? "payment-paid"
                : "payment-awaiting"
            }">${escapeHtml(paymentStatusLabel)}</span>
          </div>

          <div class="sections">
            <section class="card">
              <h2>Booking Details</h2>
              <div class="detail-row">
                <span class="detail-label">Drop-off</span>
                <span class="detail-value">${escapeHtml(formatDateTime(booking.bookedStartTime))}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pick-up</span>
                <span class="detail-value">${escapeHtml(formatDateTime(booking.bookedEndTime))}</span>
              </div>
              ${buildOptionalRow(
                "Actual Exit",
                booking.actualExitTime
                  ? formatDateTime(booking.actualExitTime)
                  : null,
              )}
              <div class="detail-row">
                <span class="detail-label">Duration</span>
                <span class="detail-value">${escapeHtml(formatDuration(scheduledHours))}</span>
              </div>
              ${
                overtimeHours > 0
                  ? `<div class="detail-row">
                      <span class="detail-label">${
                        booking.lateChargeMode === "pending"
                          ? "Current overtime"
                          : "Final overtime"
                      }</span>
                      <span class="detail-value">${escapeHtml(formatDuration(overtimeHours))}</span>
                    </div>`
                  : ""
              }
            </section>

            <section class="card">
              <h2>Vehicle and Contact</h2>
              <div class="detail-row">
                <span class="detail-label">Vehicle</span>
                <span class="detail-value">${escapeHtml(`${booking.carMake} ${booking.carModel}`)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Registration</span>
                <span class="detail-value">${escapeHtml(booking.carNumber)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Colour</span>
                <span class="detail-value">${escapeHtml(booking.carColor)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">${escapeHtml(booking.userEmail)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${escapeHtml(booking.userPhone)}</span>
              </div>
            </section>
          </div>

          ${
            booking.departureTerminal ||
            booking.departureFlightNo ||
            booking.arrivalTerminal ||
            booking.arrivalFlightNo
              ? `<section class="card" style="margin-top: 24px;">
                  <h2>Flight Details</h2>
                  ${buildOptionalRow("Departure Terminal", booking.departureTerminal)}
                  ${buildOptionalRow("Departure Flight", booking.departureFlightNo)}
                  ${buildOptionalRow("Arrival Terminal", booking.arrivalTerminal)}
                  ${buildOptionalRow("Arrival Flight", booking.arrivalFlightNo)}
                </section>`
              : ""
          }

          <section class="totals">
            <div class="line-item">
              <span>Booked parking charge</span>
              <span>${escapeHtml(formatPrice(booking.price))}</span>
            </div>
            ${
              overtimePrice > 0
                ? `<div class="line-item">
                    <span>${escapeHtml(overtimeLabel)}</span>
                    <span>${escapeHtml(formatPrice(overtimePrice))}</span>
                  </div>`
                : ""
            }
            <div class="line-item">
              <span>Payment status</span>
              <span>${escapeHtml(paymentStatusLabel)}</span>
            </div>
            <div class="total-row">
              <span>Total amount</span>
              <span>${escapeHtml(formatPrice(currentTotalPrice))}</span>
            </div>
          </section>

          <section class="notes">
            <h2>Notes</h2>
            <ul>${noteMarkup}</ul>
          </section>

          <div class="footer">
            Invoice generated from the ParkPro admin dashboard for booking ${escapeHtml(
              booking.trackingNumber,
            )}.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return true;
}
