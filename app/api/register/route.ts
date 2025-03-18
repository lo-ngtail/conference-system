import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Pool } from 'pg'; // pg ライブラリをインポート

// PostgreSQL 接続設定
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
  database: process.env.POSTGRES_DATABASE || 'mydatabase',
  user: process.env.POSTGRES_USER || 'myuser',
  password: process.env.POSTGRES_PASSWORD || 'mypassword',
});


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


    // データベースへの保存処理
    const client = await pool.connect(); // クライアントを取得
    try {
      const result = await client.query(
        'INSERT INTO participants (name, affiliation, email, phone, title, privacy_policy_agreed, registration_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [name, affiliation, email, phone, title, privacy_policy_agreed, new Date()]
      );

      const registration_id = result.rows[0].id;


      return NextResponse.json({
        status: 'success',
        message: '登録が完了しました。',
        registration_id: registration_id,
      });
    } finally {
      client.release(); // クライアントを解放
    }


  } catch (error) {
    console.error('登録処理エラー:', error); // エラーログ
    return NextResponse.json(
      {
        status: 'error',
        message: '登録処理中にエラーが発生しました。',
      },
      { status: 500 }
    );
  }
}
