import { Component, ViewChild } from '@angular/core';
import { NavController, TextInput, Button, App } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'; //20180904 ANHLD ADD
import { SQLite } from "ionic-native";
import { IsIniOperation } from '../../../inc/IsIniOperation';
import { Global } from '../../../inc/Global';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http';
import { MyApp } from '../../../app/app.component';
import { Nav, Platform } from 'ionic-angular';

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})
export class SettingPage {

    //処理の流れ用フラグ
    GLOBAL_INPUT_FLG =
        {
            "Global_inputflg": 0,
        };

    //タッチパネル対策で、画面遷移IDを設定する
    SETTING_MENU_ID =
        {
            "input_flg_Url": 0,
            "input_flg_User": 10,
            "input_flg_Password": 20,
        };

    checkLogin: boolean = false;
    barcodeData: string;
    @ViewChild(Nav) nav: Nav;
    @ViewChild('txtUrl') txtUrlInput: TextInput;
    @ViewChild('txtLoginUser') txtLoginUserInput: TextInput;
    @ViewChild('txtLoginPassword') txtLoginPasswordInput: TextInput;

    constructor(
        public navCtrl: NavController,
        public barcodeScanner: BarcodeScanner,
        public http: Http, ) {
    }

    async ionViewWillEnter() {
        //20180924 ANHLD EDIT START
        //this.txtUrlInput.value = '';

        //Read value
        this.txtUrlInput.value = await IsIniOperation.IsIniRead(Global.T_SETINI, 'API_URL');
        //20180924 ANHLD EDIT END
        this.txtLoginUserInput.value = await IsIniOperation.IsIniRead(Global.T_SETINI, 'LOGIN_USER');
        this.txtLoginPasswordInput.value = await IsIniOperation.IsIniRead(Global.T_SETINI, 'PASSWORD');
    }

    ionViewWillLeave() {

        if (this.txtUrlInput.value == '' || this.txtLoginUserInput.value == '' || this.txtLoginPasswordInput.value == '') {
            return;
        }
      
        //Write value        
        IsIniOperation.IsIniWrite(Global.T_SETINI, 'API_URL', this.txtUrlInput.value)
            .then(() => {
                this.SignIn();
            })
    }

    Scanner_OnScanned(event: any) {
        var ctrl = event.currentTarget.getAttribute("name");

        //どのスキャンボタンを押されたかによって、処理を分ける
        switch (ctrl) {
            case "btnInputUrl":
                this.GLOBAL_INPUT_FLG.Global_inputflg = this.SETTING_MENU_ID.input_flg_Url;
                break;
            case "btnInputUser":
                this.GLOBAL_INPUT_FLG.Global_inputflg = this.SETTING_MENU_ID.input_flg_User;
                break;
            case "btnInputPassword":
                this.GLOBAL_INPUT_FLG.Global_inputflg = this.SETTING_MENU_ID.input_flg_Password;
                break;
        }

        //スキャン開始
        this.barcodeScanner.scan().then(data => {

            console.log("Scan successful: " + data.text);

            switch (this.GLOBAL_INPUT_FLG.Global_inputflg) {
                //Api-url
                case this.SETTING_MENU_ID.input_flg_Url:
                    this.txtUrlInput.value = data.text
                    break;

                //Username
                case this.SETTING_MENU_ID.input_flg_User:
                    this.txtLoginUserInput.value = data.text
                    break;

                //Password
                case this.SETTING_MENU_ID.input_flg_Password:
                    this.txtLoginPasswordInput.value = data.text
                    break;

                default:
                    break;
            }
        }, (err) => {
            console.log("Scan Unsuccessful: " + err);
        });
    }

    async SignIn() {
        var apiUri = null;
        var headersReq = null;
        var options = null;

        //Set URL
        //apiUri = 'https://hsccloud-a522913.db.us2.oraclecloudapps.com/apex/hscdevelop/zaiko/api/tnto-req2?';
        apiUri = await IsIniOperation.IsIniRead(Global.T_SETINI, 'API_URL');

        //Check URI is empty
        if (apiUri == null || apiUri == "") return;

        if (apiUri.lastIndexOf('/') != apiUri.length - 1) {
            apiUri = apiUri + '/';
        }

        apiUri += 'tnto-req2' + '?';

        apiUri += 'T_PIC=' + this.txtLoginUserInput.value;
        apiUri += '&T_PASSWORD=' + this.txtLoginPasswordInput.value;

        //Set header
        headersReq = new Headers({
            'Content-Type': 'application/json'
        });

        options = new RequestOptions({ headers: headersReq });

        this.http.get(apiUri, options)
            .subscribe(async data => {
                try {
                    var jsonItem = JSON.parse(data['_body']);

                    if (jsonItem['items'] != null && jsonItem['items'].length > 0) {

                        await IsIniOperation.IsIniWrite(Global.T_SETINI, 'LOGIN_USER', this.txtLoginUserInput.value);
                        await IsIniOperation.IsIniWrite(Global.T_SETINI, 'PASSWORD', this.txtLoginPasswordInput.value);
                        Global.g_Tanto = this.txtLoginUserInput.value;
                        //alert('完了しました！');
                    }
                } catch (error) {
                    alert('エラー' + '\n' + error);
                }

            }, error => {
                alert('エラー' + '\n' + error);
            });
    }



}
