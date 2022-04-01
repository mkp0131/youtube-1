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

## 참고

### hexadecimal 16진수

- 0~9 a~f 까지 16개의 캐릭터로 숫자를 표현
- 정규표현식: [0-9a-f]+
