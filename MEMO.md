email: {type: String, required: true, unique: true},
username: {type: String, required: true, unique: true},
password: {type: String, required: true},
name: {type: String, required: true},
location: {type: String}

rootRouter

bcrypt 패키지 설치
express-session 패키지 설치
connect-mongo 패키지 설치
dotenv 패키지 설치
multer 패키지 설치 (파일 업로드 / 서버에 파일저장)
regenerator-runtime 패키지 (async, await 를 프론트단에서 사용가능)
express-flash 패키지

github rest api 문서
https://docs.github.com/en/rest/reference/users

유저정보가 없이 들어왔을시 에러를 없애기위해서
로컬 user 정보가 없다면 {} 빈 obj를 할당
users/edit 처럼 로그인되어있어야 이용할 수 있는 서비스는 url로 바로 접근 안되도록 막아야한다.
middelware 를 생성하여 ㅌㅌㅌㅌㅁ막음
미들웨어1: 로그인 사용자
미들웨어2: 비로그인 사용자

# 해야할일

1. input max 길이 변경 - 완료
2. mongoose 에서도 max 길이 지정 - 완료
3. search 페이지 고도화 (form 과 검색 결과를 같이) - 보류 😇
4. 비디오 업로드할때 오류 가드 - 완료
5. bcrypt 세팅 - 완료
6. 몽고 스토어 세팅 - 완료
7. multer 세팅(사진 업로드) - 완료
8. 깃허브 로그인 - 완료
9. 권한별 프로텍트 미들웨어 세팅(url 보호) - 완료
10. 비디오 업로드 파일 & watch - 완료
11. 유저 페이지 고도화 / 이메일, 닉네임 중복체크 기능 / photoUrl 기본값 넣기
12. pug: header 분리, scss: components, config, screens 폴더로 분리 - 완료
13. 비디오 재생 할때 애니메이션 고도화 - 완료
14. 썸네일 등록
15. flash 메세지 처리
16. 댓글 기능 세팅

# github 회원가입 / 로그인 flow

1. 원하는정보를 포함한 url 로 1단계 요청을 보낸다.
2. 1단계 요청이 완료되면 github 에서 callback url + 코드값 로 리다이렉션 한다.
3. callback url 에서 코드값 을 활요하여 유저 정보를 얻는 요청을 보낸다.
4. 만약 유저테이블에 이메일이 등록이 되어있다면 로그인처리, 없다면 회원가입 처리한다.

# view api

1. 영상이 끝날시 /api/video/:id/view 로 fetch post 요청
2. 요청이 완료되면 views 에 +1

# 동영상변화

1. ffmpeg.wasm 패키지 설치
