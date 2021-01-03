const nameParam = {
  currentPassword: `現在のパスワード（必須）`,
  postalCode: `郵便番号`,
  newPassword: `新パスワード`,
  phoneNumber: `電話番号（必須）`
}

const string = {
  email: (name) => null,
  invalidEmail: (name) => 'Email không hợp lệ',
  datePlaceHolder: 'Ngày tháng năm',
  cancelBtn: 'Bỏ qua',
  confirmBtn: 'Thông báo',
  bothEmpty: 'メモのタイトル及び内容を入力してください。',
  limitTitle: 'メモのタイトルは20文字以内で入力してください。',
  limitContent: 'メモの内容は255文字以内で入力してください。',
  required: (name) => {
    switch (name) {
      case `Email`:
        return `Email không hợp lệ`;

      case `Phone`:
        return `Số điện thoại không chính xác`;

      case `OTP`:
        return `Số OTP không hợp lệ`;

      case `Password`:
        return `Mật khẩu trống`;

      case `token`:
        return `パスコードを入力してください。`;

      case nameParam.currentPassword:
        return `${name}を入力してください。`;

      case `Name`:
        return `Tên tài khoản không hợp lệ`;

      case `Company Name`:
        return `Tên tài khoản trống`;

      default:
        return `${name}を入力してください。`;
    }
  },
  max: (length) => (name) => {
    switch (name) {
      case `Password`:
        return `Mật khẩu không hợp lệ`;
      case `Phone`:
        return `Số điện thoại không chính xác`;
      case `OTP`:
        return `Số OTP không hợp lệ`;
      case `Company Name`:
        return `Tên tài khoản không hợp lệ`;
      default:
        return `${name} ${length} 文字以上の名前を入力してください。`;
    }
  },

  min: (length) => (name) => {
    switch (name) {
      case `Name`:
        return `Tên tài khoản không hợp lệ`;
      case `Company Name`:
        return `Tên tài khoản không hợp lệ`;
      case `Phone`:
        return `Số điện thoại không chính xác`;
      case `OTP`:
        return `Số OTP không hợp lệ`;
      case `Password`:
        return `Mật khẩu không hợp lệ`;

      // new password
      case nameParam.newPassword:
        return `Nhập lại mật khẩu không hợp lệ`;

      //postal code
      case nameParam.postalCode:
        return `無効な郵便番号です。`;

      //phone number
      case nameParam.phoneNumber:
        return `Số điện thoại không hợp lệ`;

      default:
        return `${name} ${length} 文字以上の名前を入力してください。`;
    }
  },
  isNumber: (name) => {
    switch (name) {
      // postal code
      case nameParam.postalCode:
        return null;

      default:
        return `${name} 7桁の郵便番号をハイフン抜きで入力してください。`;
    }

  },
  isPast: (name) => {
    return `校正年月日を正しく入力してください。`;
  },
  passwordNotMatch: 'Password không trùng khớp',
  default: (text) => () => text,
  alert: 'Thông báo'
}

export default string;

