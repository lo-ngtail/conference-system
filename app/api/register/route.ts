import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { name, affiliation, email, phone, title, privacy_policy_agreed } = reqBody;

    if (!name) {
      return NextResponse.json({ status: 'error', message: '氏名は必須項目です。' }, { status: 400 });
    }
    if (!affiliation) {
      return NextResponse.json({ status: 'error', message: '所属は必須項目です。' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ status: 'error', message: 'メールアドレスは必須項目です。' }, { status: 400 });
    }
    if (!privacy_policy_agreed) {
      return NextResponse.json({ status: 'error', message: 'プライバシーポリシーへの同意は必須です。' }, { status: 400 });
    }

    // email形式のバリデーション
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ status: 'error', message: 'メールアドレスの形式が正しくありません。' }, { status: 400 });
    }

    // 電話番号形式のバリデーション (より厳密なチェック)
    if (phone && !/^[0-9]{2,4}-[0-9]{2,4}-[0-9]{3,4}$/.test(phone)) {
      return NextResponse.json({ status: 'error', message: '電話番号の形式が正しくありません。' }, { status: 400 });
    }


    // TODO: データベースへの保存処理を実装

    return NextResponse.json({
      status: 'success',
      message: '登録が完了しました。',
      registration_id: 'dummy_id', // 仮のID
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'エラーが発生しました。',
      },
      { status: 500 }
    );
  }
}
