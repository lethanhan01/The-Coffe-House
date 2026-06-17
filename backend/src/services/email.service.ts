import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'The Coffee House <onboarding@resend.dev>';

const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
    const { error } = await resend.emails.send({ from: FROM_EMAIL, to: [to], subject, html });
    if (error) {
        console.error('✗ Failed to send email:', error);
        return false;
    }
    return true;
};

// HTML Email Template for Booking Confirmation (Vietnamese)
const generateBookingConfirmationEmailVN = (
    userName: string,
    cafeName: string,
    bookingDate: string,
    bookingTime: string,
    numberOfPeople: number,
    address: string,
    cafePhone: string,
    bookingId: number
): string => {
    const formattedDate = new Date(bookingDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: white; padding: 30px; }
            .booking-details { background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; }
            .detail-row { display: flex; margin: 10px 0; }
            .detail-label { font-weight: bold; width: 150px; color: #8B4513; }
            .detail-value { flex: 1; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-message { color: #27ae60; font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>☕ The Coffee House</h1>
                <p>Xác Nhận Đặt Chỗ</p>
            </div>

            <div class="content">
                <p>Xin chào <strong>${userName}</strong>,</p>

                <div class="success-message">✓ Đặt chỗ của bạn đã được chấp nhận</div>

                <p>Cảm ơn bạn đã chọn ${cafeName}. Đây là thông tin chi tiết đặt chỗ của bạn:</p>

                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-label">ID Đặt Chỗ:</div>
                        <div class="detail-value">${bookingId}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Quán Cafe:</div>
                        <div class="detail-value"><strong>${cafeName}</strong></div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Ngày:</div>
                        <div class="detail-value">${formattedDate}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Thời Gian:</div>
                        <div class="detail-value">${bookingTime}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Số Người:</div>
                        <div class="detail-value">${numberOfPeople} người</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Địa Chỉ:</div>
                        <div class="detail-value">${address}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Số Điện Thoại:</div>
                        <div class="detail-value"><a href="tel:${cafePhone}">${cafePhone}</a></div>
                    </div>
                </div>

                <p>Quán mong bạn đến đúng giờ một cách tế nhị, nếu có thay đổi hãy thông báo trước với quán.</p>

                <p>Trân trọng,<br><strong>The Coffee House Team</strong></p>
            </div>

            <div class="footer">
                <p>Đây là email tự động, vui lòng không reply email này.</p>
                <p>&copy; 2026 The Coffee House. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// HTML Email Template for Booking Confirmation (Japanese)
const generateBookingConfirmationEmailJP = (
    userName: string,
    cafeName: string,
    bookingDate: string,
    bookingTime: string,
    numberOfPeople: number,
    address: string,
    cafePhone: string,
    bookingId: number
): string => {
    const formattedDate = new Date(bookingDate).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: white; padding: 30px; }
            .booking-details { background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; }
            .detail-row { display: flex; margin: 10px 0; }
            .detail-label { font-weight: bold; width: 150px; color: #8B4513; }
            .detail-value { flex: 1; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .success-message { color: #27ae60; font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>☕ ザ・コーヒーハウス</h1>
                <p>ご予約確認</p>
            </div>

            <div class="content">
                <p><strong>${userName}</strong>様へ、</p>

                <div class="success-message">✓ ご予約が正常に確認されました。</div>

                <p>${cafeName}をお選びいただきありがとうございます。ご予約の詳細情報は以下の通りです：</p>

                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-label">ご予約ID:</div>
                        <div class="detail-value">${bookingId}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">カフェ:</div>
                        <div class="detail-value"><strong>${cafeName}</strong></div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">日付:</div>
                        <div class="detail-value">${formattedDate}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">時間:</div>
                        <div class="detail-value">${bookingTime}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">人数:</div>
                        <div class="detail-value">${numberOfPeople}名</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">住所:</div>
                        <div class="detail-value">${address}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">電話番号:</div>
                        <div class="detail-value"><a href="tel:${cafePhone}">${cafePhone}</a></div>
                    </div>
                </div>

                <p>ご予約のリクエストはカフェで確認され、できるだけ早くご返信いたします。変更やキャンセルが必要な場合は、事前にお知らせください。</p>

                <p>よろしくお願いいたします。<br><strong>ザ・コーヒーハウス チーム</strong></p>
            </div>

            <div class="footer">
                <p>このメールは自動配信です。このメールに返信しないでください。</p>
                <p>&copy; 2026 The Coffee House. 著作権所有。</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (
    userEmail: string,
    userName: string,
    cafeName: string,
    bookingDate: string,
    bookingTime: string,
    numberOfPeople: number,
    address: string,
    cafePhone: string,
    bookingId: number,
    language: string = 'vi'
): Promise<boolean> => {
    if (!userEmail) {
        console.error('User email is required');
        return false;
    }

    const html = language === 'jp'
        ? generateBookingConfirmationEmailJP(userName, cafeName, bookingDate, bookingTime, numberOfPeople, address, cafePhone, bookingId)
        : generateBookingConfirmationEmailVN(userName, cafeName, bookingDate, bookingTime, numberOfPeople, address, cafePhone, bookingId);

    const subject = language === 'jp'
        ? 'ご予約確認 | The Coffee House'
        : 'Xác Nhận Đặt Chỗ | The Coffee House';

    return sendEmail(userEmail, subject, html);
};

// Send booking cancellation email
export const sendBookingCancellationEmail = async (
    userEmail: string,
    userName: string,
    cafeName: string,
    bookingId: number,
    language: string = 'vi'
): Promise<boolean> => {
    if (!userEmail) {
        console.error('User email is required');
        return false;
    }

    const subject = language === 'jp'
        ? 'ご予約キャンセル | The Coffee House'
        : 'Hủy Đặt Chỗ | The Coffee House';

    const html = language === 'jp'
        ? `
        <h2>ご予約がキャンセルされました</h2>
        <p><strong>${userName}</strong>様へ、</p>
        <p>ご予約ID: ${bookingId} のご予約がキャンセルされました。</p>
        <p>ご不明な点がございましたら、お問い合わせください。</p>
        `
        : `
        <h2>Đặt Chỗ Đã Bị Hủy</h2>
        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>Đặt chỗ ID: ${bookingId} tại ${cafeName} đã bị hủy.</p>
        <p>Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
        `;

    return sendEmail(userEmail, subject, html);
};

export const sendBookingStatusUpdateEmailToCustomer = async (
    userEmail: string,
    userName: string,
    cafeName: string,
    bookingDate: string,
    bookingTime: string,
    numberOfPeople: number,
    status: 'confirmed' | 'approved' | 'rejected',
    bookingId: number,
    language: string = 'vi'
): Promise<boolean> => {
    if (!userEmail) {
        console.error('User email is required');
        return false;
    }

    const isAccepted = status === 'confirmed' || status === 'approved';
    const subject = language === 'jp'
        ? isAccepted
            ? 'ご予約が承認されました | The Coffee House'
            : 'ご予約が拒否されました | The Coffee House'
        : isAccepted
            ? 'Yêu Cầu Đặt Chỗ Đã Được Chấp Nhận | The Coffee House'
            : 'Yêu Cầu Đặt Chỗ Đã Bị Từ Chối | The Coffee House';

    const formattedDate = new Date(bookingDate).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const html = language === 'jp'
        ? `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { background-color: white; padding: 30px; }
                .booking-details { background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; }
                .detail-row { display: flex; margin: 10px 0; }
                .detail-label { font-weight: bold; width: 150px; color: #8B4513; }
                .detail-value { flex: 1; }
                .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
                .status-message { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px; }
                .accepted { color: #27ae60; }
                .rejected { color: #dc2626; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>☕ ザ・コーヒーハウス</h1>
                </div>
                <div class="content">
                    <p><strong>${userName}</strong>様へ、</p>
                    <div class="status-message ${isAccepted ? 'accepted' : 'rejected'}">
                        ${isAccepted ? '✓ ご予約が承認されました！' : '✗ ご予約が拒否されました。'}
                    </div>
                    ${isAccepted
                        ? '<p>ご予約ありがとうございます。以下がご予約の詳細です：</p>'
                        : '<p>申し訳ございません。この度はご期待に沿えず失礼いたしました。以下がご予約の詳細です：</p>'
                    }
                    <div class="booking-details">
                        <div class="detail-row">
                            <div class="detail-label">ご予約ID:</div>
                            <div class="detail-value">${bookingId}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">カフェ:</div>
                            <div class="detail-value"><strong>${cafeName}</strong></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">日付:</div>
                            <div class="detail-value">${formattedDate}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">時間:</div>
                            <div class="detail-value">${bookingTime}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">人数:</div>
                            <div class="detail-value">${numberOfPeople}名</div>
                        </div>
                    </div>
                    ${isAccepted
                        ? '<p>ご予約時間にお越しください。変更やキャンセルが必要な場合は、事前にお知らせください。</p>'
                        : '<p>別の日時でのご利用をお待ちしております。ご不明な点やご相談がございましたら、お気軽にお問い合わせください。</p>'
                    }
                </div>
                <div class="footer">
                    <p>このメールは自動送信です。返信しないでください。</p>
                </div>
            </div>
        </body>
        </html>
        `
        : `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
                .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { background-color: white; padding: 30px; }
                .booking-details { background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; }
                .detail-row { display: flex; margin: 10px 0; }
                .detail-label { font-weight: bold; width: 150px; color: #8B4513; }
                .detail-value { flex: 1; }
                .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
                .status-message { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px; }
                .accepted { color: #27ae60; }
                .rejected { color: #dc2626; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>☕ The Coffee House</h1>
                    <p>${isAccepted ? 'Xác Nhận Đặt Chỗ' : 'Thông Báo Từ Chối Đặt Chỗ'}</p>
                </div>
                <div class="content">
                    <p>Xin chào <strong>${userName}</strong>,</p>
                    <div class="status-message ${isAccepted ? 'accepted' : 'rejected'}">
                        ${isAccepted ? '✓ Đặt chỗ của bạn đã được chấp nhận' : '✗ Đặt chỗ của bạn đã bị từ chối.'}
                    </div>
                    ${isAccepted
                        ? '<p>Cảm ơn bạn đã chọn ' + cafeName + '. Đây là thông tin chi tiết đặt chỗ của bạn:</p>'
                        : '<p>Quán xin lỗi vì không thể chấp nhận yêu cầu đặt chỗ này. Dưới đây là thông tin chi tiết đặt chỗ:</p>'
                    }
                    <div class="booking-details">
                        <div class="detail-row">
                            <div class="detail-label">ID Đặt Chỗ:</div>
                            <div class="detail-value">${bookingId}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Quán Cafe:</div>
                            <div class="detail-value"><strong>${cafeName}</strong></div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Ngày:</div>
                            <div class="detail-value">${formattedDate}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Thời Gian:</div>
                            <div class="detail-value">${bookingTime}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Số Người:</div>
                            <div class="detail-value">${numberOfPeople} người</div>
                        </div>
                    </div>
                    ${isAccepted
                        ? '<p>Vui lòng đến quán đúng giờ để chúng tôi có thể phục vụ bạn tốt nhất. Nếu bạn cần thay đổi hoặc có bất kỳ thắc mắc, xin vui lòng thông báo trước cho quán.</p>'
                        : '<p>Xin cảm ơn bạn đã lựa chọn The Coffee House. Chúng tôi rất mong được phục vụ bạn vào một dịp khác.</p>'
                    }
                    <p>Trân trọng,<br><strong>The Coffee House Team</strong></p>
                </div>
                <div class="footer">
                    <p>Đây là email tự động, vui lòng không reply email này.</p>
                    <p>&copy; 2026 The Coffee House. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>
        `;

    return sendEmail(userEmail, subject, html);
};

// Send booking status update email (for cafe owner)
export const sendBookingStatusUpdateEmail = async (
    ownerEmail: string,
    ownerName: string,
    customerName: string,
    cafeName: string,
    bookingDate: string,
    bookingTime: string,
    numberOfPeople: number,
    status: string,
    language: string = 'vi'
): Promise<boolean> => {
    if (!ownerEmail) {
        console.error('Owner email is required');
        return false;
    }

    const subject = language === 'jp'
        ? `ご予約ステータス更新: ${status} | The Coffee House`
        : `Cập Nhật Trạng Thái Đặt Chỗ: ${status} | The Coffee House`;

    const html = language === 'jp'
        ? `
        <h2>ご予約ステータスが更新されました</h2>
        <p><strong>${ownerName}</strong>様へ、</p>
        <p><strong>${customerName}</strong>様のご予約がステータス <strong>${status}</strong> に更新されました。</p>
        <p>日付: ${bookingDate}<br/>
        時間: ${bookingTime}<br/>
        人数: ${numberOfPeople}名</p>
        `
        : `
        <h2>Trạng Thái Đặt Chỗ Được Cập Nhật</h2>
        <p>Xin chào <strong>${ownerName}</strong>,</p>
        <p>Đặt chỗ của <strong>${customerName}</strong> đã được cập nhật trạng thái: <strong>${status}</strong>.</p>
        <p>Ngày: ${bookingDate}<br/>
        Thời gian: ${bookingTime}<br/>
        Số người: ${numberOfPeople}</p>
        `;

    return sendEmail(ownerEmail, subject, html);
};
