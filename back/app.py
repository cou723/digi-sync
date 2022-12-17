import os  # pathの取得などに使う
import json  # 何かと使う
from flask import Flask, redirect, request, url_for  # flaskを使うのに絶対必要
from flask import jsonify  # jsonを送るのに使う
from flask_cors import CORS, cross_origin  # crosの設定
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)

from flask_login import UserMixin
from oauthlib.oauth2 import WebApplicationClient
import requests


class User(UserMixin):
    def __init__(self, id_, name, email, profile_pic):
        self.id = id_
        self.name = name
        self.email = email
        self.profile_pic = profile_pic


basedir = os.path.abspath(os.path.dirname(__file__))  # 実行folderのpathを取得、何かと使う

app = Flask(__name__, instance_relative_config=True)  # アプリの作成
app.config.from_mapping(  # アプリの設定
    None  # 今は何も無い
)

GOOGLE_CLIENT_ID = os.environ.get(
    "GOOGLE_CLIENT_ID",
    "822488502520-j68h8igrkon0gfceo64brl8dbfesd2l2.apps.googleusercontent.com")
GOOGLE_CLIENT_SECRET = os.environ.get(
    "GOOGLE_CLIENT_SECRET",
    "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")
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# Flaskセットアップ
app = Flask(__name__)
# セッション情報を暗号化するためのキーを設定
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

# ユーザセッション管理の設定
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.unauthorized_handler
def unauthorized():
    return "You must be logged in to access this content.", 403


# OAuth2クライアント設定
client = WebApplicationClient(GOOGLE_CLIENT_ID)


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


@app.route("/import")
@login_required
def import_url(id):
    return jsonify({"url": "https://example.com"})


@app.route("/")
def index():
    return jsonify({"url": "https://exmaple.com"})


@app.route("/login")
def login():
    # 認証用のエンドポイントを取得する
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # ユーザプロファイルを取得するログイン要求
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@app.route("/logout")
@login_required
def logout():
    return jsonify({"url": "https://exmaple.com"})


@app.route("/login/callback")
def callback():
    # Googleから返却された認証コードを取得する
    code = request.args.get("code")

    # トークンを取得するためのURLを取得する
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # トークンを取得するための情報を生成し、送信する
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # トークンをparse
    client.parse_request_body_response(json.dumps(token_response.json()))

    # トークンができたので、GoogleからURLを見つけてヒットした、
    # Googleプロフィール画像やメールなどのユーザーのプロフィール情報を取得
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # メールが検証されていれば、名前、email、プロフィール画像を取得します
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # Googleから提供された情報をもとに、Userを生成する
    user = User(
        id_=unique_id, name=users_name, email=users_email, profile_pic=picture
    )

    # ログインしてユーザーセッションを開始
    login_user(user)

    return redirect(url_for("index"))





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # アプリの実行
