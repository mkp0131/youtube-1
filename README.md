# Youtube 클론 JS

## routes

- [ ] Home - '/' - 트렌드 비디오 보여줌
- [ ] Join - '/join'
- [ ] Login - '/login'
- [ ] Search - '/serach' - 비디오 찾기

- [ ] Edit Profile - '/user/edit'
- [ ] Delete User - '/user/delete'

- [ ] Upload Video - '/video/upload'
- [ ] Watch Video - '/video/:id'
- [ ] Edit Video - '/video/:id/edit'
- [ ] Delete Video - '/video/:id/delete'

## 정규 표현식

### 그룹과 범위

- `|` 또는
- `()` 그룹
- `(?:)` 찾지만 그룹을 만들진 않음.
- `[]` 문자 집합, 괄호안의 어떤 문자든
- `[^]` 문자 집합 부정, 괄호안의 문자가 안들어간 것

### 수량 (앞에 문자의 수량)

- `?` 0~1 / 있거나 없거나
- `*` 0~Infinity / 없거나 있거나 많거나
- `+` 1~Infinity / 있거나 많거나
- `{숫자}` 숫자 / 숫자 많큼 있다. 반복
- `{min, }` min~Infinity / 최소 min 많큼 있다.
- `{min, max}` min~max / 최소 ~ 최대

### 경계

- `/b` 공백 / 단어경계
- `/B` 공백X / 단어경계가 아님
- `^` 행의 시작 / 멀티라인 (정규표현식 맨앞에 사용)
- `$` 행의 끝 / 멀티라인 (정규표현식 맨뒤에 사용)

### 특수문자

- `\` 특수문자 escape
- `.` 어떤글자(줄바꿈 제외, 공백 포함)
- `\d` 숫자
- `\D` 숫자가 아닌 것
- `\w` 문자 (괄호 같은 특수문자는 아님, 숫자포함)
- `\W` 문자가 아닌 것 (괄호 같은 특수 문자만 선택)
- `\s` 공백 (줄바꿈 제외)
- `\S` 공백이 아닌 것 (괄호, 숫자, 문자 모두 포함.)

## 몽고db

### 설치

```
xcode-select --install // xcode 가 설치되어있지 않은 경우
brew tap mongodb/brew
brew install mongodb-community
mongod --version // 설치확인

brew services start mongodb-community // mongo 시작
brew services stop mongodb-community // mongo 끄기

mongo // mongo shell 접근 // mongodb-community 시작되어야 작동
```

### 구조

- database (mysql: database)
- collection (mysql: table)
- document (mysql: row)
- fields (mysql: column)

### mongo shell

- show dbs // db 리스트
- use ${database} // 데이터 베이스이름을 적어주면 데이터 베이스로 switch
- show collections // 컬렉션 보기
- db.${coll}.find() // 컬렉션 안에 문서 보기
- db.${coll}.remove({}) // 컬렉션 안에 문서 모두 삭제!

### mongoose

- API 문서: https://mongoosejs.com/docs/api.html
- node 에서 mongodb 접속을 도와주는 패키지
- 스키마(컬렉션 구조)를 생성하여 값을 가져오고 업데이트한다.

### 프로젝트 mongodb 구조

#### videos

```json
{
  title: {type: String, required: true},
  description: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  hashtags: [{type: String}],
  meta: {
    views: {type: Number, required: true, default: 0},
    rating: {type: Number, required: true, default: 0},
  }
}
```

### 사용법

- 서버 접속

```js
// 로컬 서버에 접속할 경우
mongoose.connect('mongodb://localhost:27017/myapp');

// 클라우드 서버에 접속할 때
mongoose.connect('mongodb://username:password@host:port/database?options...');
```

- 스키마 만들기

```js
// 스키마 정보 생성
const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

// 몽구스 모델 & 컬렉션 생성
const Video = mongoose.model('Video', videoSchema);

export default Video;
```

- doc 저장

```js
// new MyModel(doc).save() 를 실행하는 것이 MyModel.create(docs) 이다.
await Video.create({
  title,
  description,
});
```

- 스키마에 함수저장해서 사용 satatic

```js
// 등록
videoSchema.static('formatHashtags', (hashtags) => {
  // return hashtags.
  return hashtags
    .split(',')
    .map((word) => (word.startsWith('#') ? word : '#' + word));
});

// 사용
await Video.create({
  title,
  description,
  hashtags: Video.formatHashtags(hashtags), // static 함수 사용
});
```

- 스키마에 데이터 저장시 이벤트 등록해서 사용
- pre 메소드
- this 를 통해 저장되는 문서에 접근(🧤🧤🧤 this 를 활용하기 때문에 화살표함수 사용 안됨!)
- 저장하는 함수에 따라 실행이 안될 수 있음.

```js
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});
```

### 데이터 조회

- 전체 데이터 조회

```js
videos = await Video.find().sort({ createdAt: 'desc' });
```

- 특정 필드만 조회 (정규표현식 사용)

```js
videos = await Video.find({
  title: {
    $regex: new RegExp(keyword, 'i'),
  },
});
```

### 삭제

```js
const video = await Video.exists({ _id: id });
```

### 업데이트

```js
await Video.findByIdAndUpdate(id, {
  title,
  description,
  hashtags: Video.formatHashtags(hashtags),
});
```

### 🧤🧤🧤 업데이트시 주의사항

- Middleware와 Validator가 호출되지 않는 경우가 있습니다. 이 경우 잘못된 데이터를 DB에 저장하려고 해도 모델을 검사하는 모든 작업을 우회하여 그대로 DB에 때려박을 것입니다. 위와 같은 일은 Mongoose가 ORM을 이용한 데이터 핸들링과 DB에 직접 데이터를 때려박는 두가지 기능을 모두 제공하기 때문에 발생
- MongoDB에서 findOneAndUpdate()는 findOne()과 update() 쿼리의 조합이 아니라 별개의 쿼리로 실행됩니다. 그리고 Mongoose에서 Query.findByIdAndUpdate() 는 Query.findOneAndUpdate({ \_id: id }, ...) 의 alias입니다

```js
await User.where({ _id: id })
  .update({ name: 'Omega' })
  .setOptions({ runValidators: true }) // 옵션을 사용하여 해결
  .exec();
```

## webpack

### 설치 및 세팅

```
npm i webpack webpack-cli -D
```

- webpack.config.js
- webpack 내에 문서에서는 babel 사용불가. 즉, nodejs 기본 문법을 따라야한다.
- package.json 에 webpack 명령어 추가

```
assets: "webpack --config webpack.config.js"
// webpack.config.js 로 사용한다면 wepack 으로도 충분하다.
// --config 뒤에는 어떤 파일을 config 파일로 사용할 것 인지에 대한 옵션
```

### js

- npm install -D babel-loader 설치

### css

```
npm i style-loader css-loader sass sass-loader -D
```

- sass: sass 패키지
- sass-loader: sass 를 webpack 에서 사용가능하도록 해주는 패키지
- css-loader: @import, url() 을 해석
- style-loader: css를 DOM 에 주입

#### 사용법1

- entry 파일(js파일) 에 scss 파일을 import

```js
import ../scss/styles.scss
```

- webpack이 해석하는 순서의 역순으로 loader 들을 나열.
- head에 css가 inline 으로 들어간다.

#### 🧤🧤🧤 사용법2

- css파일을 분리하여 사용하기 원할경우 style-loader 사용 X, mini-css-extract-plugin 를 사용!

```
npm install --save-dev mini-css-extract-plugin
```

### 총정리 코드

```js
// main.js (엔트리 파일)
import '../css/styles.scss';
```

```js
// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css 파일로 분리 플러그인

module.exports = {
  mode: 'development', // 모드 (개발시: development, 실서비스: production)
  watch: true, // 워치모드
  entry: './src/client/js/main.js', // 엔트리
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'js/main.js',
    clean: true, // 하나로 모으기전에 파일을 청소(삭제)
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
```

## 배포

1. express => babel-cli 이용

```json
"build:server": "babel src -d build",
```

2. 프론트 엔드 => webpack 사용

```json
// --mode 속성을 명령어로 준다
"build:assets": "webpack --mode=production",
"dev:assets": "webpack --mode=development"
```

3. heroku 업로드시 build 명령어 추가

```json
"build": "npm run build:server && npm run build assets",
```

4. 몽고db => 몽고db atlas 이용 => 네이티브 드라이브 선택

5. heroku setting => Config Vars 에서 환경변수(env) 세팅

6. 파일저장 => aws s3

## 참고

### hexadecimal 16진수

- 0~9 a~f 까지 16개의 캐릭터로 숫자를 표현
- 정규표현식: [0-9a-f]+
