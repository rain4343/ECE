# ڕێنمایی کارپێکردنی پرۆژە لەسەر کۆمپیوتەر

ئەم ڕێنماییە بۆ Windows، macOS و Linux ـە. پرۆژەکە frontend ـی Next.js، API ـی NestJS و PostgreSQL بەکاردهێنێت.

## 1. پێداویستییەکان

دامەزرێنە:

- Node.js 22 یان نوێتر: https://nodejs.org/
- npm 10 یان نوێتر؛ لەگەڵ Node.js دێت.
- PostgreSQL 14 یان نوێتر: https://www.postgresql.org/download/
- Git، ئەگەر repository ـەکە clone دەکەیت: https://git-scm.com/downloads

دوای دامەزراندن، PowerShell یان Terminal بکەرەوە و پشتڕاستی بکەرەوە:

```bash
node --version
npm --version
psql --version
```

## 2. ئامادەکردنی کۆدەکە

ئەگەر ZIP ـەکەت هەیە:

1. `un-project-complete.zip` extract بکە.
2. فولدەری extract کراو بکەرەوە.
3. Terminal لە هەمان فولدەردا بکەرەوە.

ئەگەر لە GitHub وەری دەگریت:

```bash
git clone https://github.com/rain4343/un.git
cd un
```

## 3. دامەزراندنی package ـەکان

لە root ـی پرۆژەکە ئەمە جێبەجێ بکە:

```bash
npm install
```

ئەم command ـە package ـەکانی frontend و API ـی workspace ـەکە دادەمەزرێنێت. پێویست نییە `npm install` بە جیاوازی لە `api` جێبەجێ بکەیت.

## 4. دروستکردنی Database

لە PostgreSQL ـدا database ـێک بە ناوی `unicef_kg` دروست بکە.

لە Windows ـدا دەتوانیت pgAdmin بەکاربهێنیت:

1. pgAdmin بکەرەوە.
2. بچۆ بۆ `Servers > PostgreSQL > Databases`.
3. Right click لەسەر `Databases` بکە.
4. `Create > Database` هەڵبژێرە.
5. ناوی database بنووسە: `unicef_kg`.
6. Save بکە.

یان لە psql:

```sql
CREATE DATABASE unicef_kg;
```

ئەگەر username و password ـی PostgreSQL ـەکەت جیاوازن، لە `.env` ـدا بگۆڕە.

## 5. دروستکردنی `.env`

لە root ـی پرۆژەکە:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

پاشان `.env` بکەرەوە و بەهای گونجاو دابنێ:

```env
DATABASE_URL=postgres://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/unicef_kg
API_PORT=4000
API_ORIGIN=http://localhost:4000
WEB_ORIGIN=http://localhost:3000
AUTH_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
SEED_ADMIN_EMAIL=admin@unicef.local
SEED_ADMIN_PASSWORD=ChangeThisToAStrongPassword123!
```

`YOUR_POSTGRES_PASSWORD` بە password ـی PostgreSQL ـەکەت بگۆڕە.

بۆ دروستکردنی secret ـێکی بەهێز:

```bash
openssl rand -base64 48
```

ئەگەر `openssl` لە Windows ـدا نەبوو، دەتوانیت secret ـێکی هەڕەمەکی لە password manager یان PowerShell دروست بکەیت؛ بەڵام دەبێت لانیکەم 32 پیت بێت.

تێبینی: `.env` نابێت upload یان commit بکرێت.

## 6. دروستکردنی migration و database setup

لە root ـی پرۆژەکە:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

- `db:generate`: migration دروست دەکات دوای گۆڕینی schema.
- `db:migrate`: خشتەکانی database دروست یان نوێ دەکاتەوە.
- `db:seed`: administrator ـی سەرەتایی دروست دەکات.

زانیاریی login ـی seed:

- Email: ئەوەی لە `SEED_ADMIN_EMAIL` ـە.
- Password: ئەوەی لە `SEED_ADMIN_PASSWORD` ـە.

Password ـی نموونە بەکارمەهێنە لە ژینگەی ڕاستەقینە.

## 7. کارپێکردنی API

Terminal ـێکی نوێ بکەرەوە، بچۆ root ـی پرۆژەکە و جێبەجێ بکە:

```bash
npm run dev:api
```

API لەسەر ئەم ناونیشانە دەستپێدەکات:

```text
http://localhost:4000
```

بۆ پشکنینی health:

```text
http://localhost:4000/health
```

دەبێت وەڵامێکی وەک ئەمە ببینیت:

```json
{"status":"ok","database":"configured","message":"API is healthy"}
```

ئەم terminal ـە مەداخە، چونکە API پێویستی بە بەردەوامبوون هەیە.

## 8. کارپێکردنی Frontend

Terminal ـێکی دووەم بکەرەوە، لە root ـی پرۆژەکە:

```bash
npm run dev
```

Frontend لەسەر ئەمە دەبێتەوە:

```text
http://localhost:3000
```

بۆ کوردی:

```text
http://localhost:3000/ckb
```

بۆ عەرەبی:

```text
http://localhost:3000/ar
```

بۆ ئینگلیزی:

```text
http://localhost:3000/en
```

بۆ login:

```text
http://localhost:3000/ckb/login
```

## 9. ڕێکخستنی پڕۆژە

لە root ـی پرۆژەکە:

```text
src/       Frontend و shared logic
api/       NestJS API
messages/  وەرگێڕانەکان
 drizzle/  migration ـەکانی database
public/    وێنە و asset ـەکان
.env       نهێنییەکانی ژینگە؛ commit ناکرێت
```

## 10. تاقیکردنەوەی build

پێش بەکارهێنانی production:

```bash
npm run lint
npm run build
npm run build:api
```

بۆ کارپێکردنی production build:

```bash
npm run start:api
npm start
```

لە production ـدا دڵنیابە کە `WEB_ORIGIN` و `API_ORIGIN` بە domain ـی ڕاستەقینە دانراون و HTTPS بەکاردهێنیت.

## 11. کێشە باوەکان

### `password authentication failed for user postgres`

Password ـی PostgreSQL لە `DATABASE_URL` هەڵەیە. password ـەکە لە `.env` چاک بکە.

### `database does not exist`

Database ـی `unicef_kg` دروست نەکراوە. لە pgAdmin یان psql دروستی بکە.

### `ECONNREFUSED 127.0.0.1:5432`

خزمەتگوزاری PostgreSQL کار ناکات. PostgreSQL service دەستپێبکە و دووبارە تاقی بکەوە.

### `AUTH_SECRET must be at least 32 characters`

`AUTH_SECRET` لە `.env` کەمە. secret ـێکی درێژتر دابنێ.

### `EADDRINUSE: port 3000` یان `port 4000`

پڕۆسەیەکی تر port ـەکەی بەکارهێناوە. یان پڕۆسەکە بوەستێنە، یان `API_PORT` بگۆڕە.

### PowerShell ـدا `npm.ps1 cannot be loaded`

PowerShell بەڕێوەبەر بکەرەوە و ئەمە جێبەجێ بکە:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

پاشان Terminal ـەکە دابخە و دووبارەی بکەرەوە.

## 12. گرنگ بۆ multi-user و online

بۆ بەکارهێنانی چەند شوێن و چەند بەکارهێنەر، PostgreSQL ـی هەمان online database دەبێت بەکاربهێنرێت و API ـەکە دەبێت لە server ـێکی هەمیشەیی وەک Railway کار بکات. `.env` ـی local تەنها بۆ تاقیکردنەوەی کۆمپیوتەرەکەتە.

هەروەها پێش بەکارهێنانی production ـی multi-user، workflow ـە پارێزراوەکان دەبێت بە API ـی server-backed پەیوەست بکرێن؛ browser local state نابێت بنکەی داتا یان authorization بێت.
