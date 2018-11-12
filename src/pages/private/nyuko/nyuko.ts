//プラグイン/モジュールなど ---------------------------------------------------------
import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ToastController, Platform, TextInput, Label, LoadingController, Button } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Vibration } from '@ionic-native/vibration';
import { Keyboard } from 'ionic-native';
import { Http, Headers, RequestOptions, Jsonp } from '@angular/http'; //20180926 ANHLD ADD

//HEARTIS関数 -----------------------------------------------------------------------
import { IsDispOperation } from '../../../inc/IsDispOperation';
import { IsIniOperation } from '../../../inc/IsIniOperation';
import { Global } from '../../../inc/Global';

@Component({
    selector: 'page-nyuko',
    templateUrl: 'nyuko.html'
})

export class NyukoPage {
    //********************************************************************************
    //型宣言
    //********************************************************************************

    //処理の流れ用フラグ
    GLOBAL_INPUT_FLG =
        {
            "Global_inputflg": 0,
            "Global_prevflg": 0,
            "Global_nextflg": 0
        };

    //タッチパネル対策で、画面遷移IDを設定する
    F_01_IN_MENU_ID =
        {
            "input_flg_BackToMenu": 0,
            "input_flg_Tanaban": 10,
            "input_flg_Hinban": 20,
            "input_flg_Suryo": 30,
            "input_flg_Write": 90
        };

    //変数用オブジェクト
    //txtTanaban: string;
    //txtHinban: string;
    //txtSuryo: string;

    //Focus用オブジェクト
    @ViewChild('txtTanaban') txtTanabanInput: TextInput;    //20180912 ANHLD EDIT
    @ViewChild('txtHinban') txtHinbanInput: TextInput;      //20180912 ANHLD EDIT
    @ViewChild('txtSuryo') txtSuryoInput: TextInput;        //20180912 ANHLD EDIT
    //20180926 ANHLD ADD START
    lblTanamei: string;
    lblHinmei: string;
    isTanaHidden: boolean;
    isHinmeiHidden: boolean;
    //20180926 ANHLD ADD END

    //********************************************************************************
    //関数書き込み
    //********************************************************************************

    //********************************************************************************
    //コンストラクタ
    //********************************************************************************
    constructor(
        public nvavCtrl: NavController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public platform: Platform,
        public barcodeScanner: BarcodeScanner,
        public loadingCtrl: LoadingController,
        public http: Http) {
        //戻るボタンが押された場合のイベントを登録しておく
        platform.registerBackButtonAction(() => {
            this.onClick_BackButton();
        });
    }

    //********************************************************************************
    //戻るキーが押された場合(Android)
    //********************************************************************************
    onClick_BackButton() {
        switch (this.GLOBAL_INPUT_FLG.Global_inputflg) {
            //棚番入力
            case this.F_01_IN_MENU_ID.input_flg_Tanaban:
                //20180912 ANHLD EDIT START
                //this.txtTanaban = "";
                this.txtTanabanInput.value = "";
                //20180912 ANHLD EDIT END
                break;

            //品番入力
            case this.F_01_IN_MENU_ID.input_flg_Hinban:
                //20180912 ANHLD EDIT START
                //this.txtHinban = "";
                this.txtHinbanInput.value = "";
                //20180912 ANHLD EDIT END
                break;

            //数量入力
            case this.F_01_IN_MENU_ID.input_flg_Suryo:
                //20180912 ANHLD EDIT START
                //this.txtSuryo = "";
                this.txtSuryoInput.value = "";
                //20180912 ANHLD EDIT END
                break;

            default:
                return;
        }
        //前項目に戻る
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.GLOBAL_INPUT_FLG.Global_prevflg;
        this.In_Menu();
    }

    //********************************************************************************
    //ページ読み込み時
    //********************************************************************************
    //ionViewDidEnter()
    //ionViewDidLoad()
    ionViewWillEnter() {
        //初期化
        //20180912 ANHLD EDIT START
        //this.txtTanaban = "";
        //this.txtHinban = "";
        //this.txtSuryo = "";

        this.txtTanabanInput.value = "";
        this.txtHinbanInput.value = "";
        this.txtSuryoInput.value = "";
        //20180912 ANHLD EDIT END

        //20180926 ANHLD ADD START
        this.isTanaHidden = true;
        this.isHinmeiHidden = true;
        //20180926 ANHLD ADD END

        //初期画面へ移動 ----------------------------------------------------------------
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Tanaban;
        //this.In_Menu();

        setTimeout(() => {
            Keyboard.show() // for android
            this.txtTanabanInput.setFocus();
        }, 1000);

        //初期画面へ移動 ----------------------------------------------------------------
    }

    //********************************************************************************
    //スキャナーイベント
    //********************************************************************************
    Scanner_OnScanned(event: any) {
        //20181001 ANHLD EDIT START
        //var ctrl = event.target.parentElement.getAttribute("name");
        var ctrl = event.currentTarget.getAttribute("name");
        //20181001 ANHLD EDIT END

        //どのスキャンボタンを押されたかによって、処理を分ける
        switch (ctrl) {
            case "btnTanaban":
                this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Tanaban;
                break;
            case "btnHinban":
                this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Hinban;
                break;
        }
        this.In_Menu();

        //スキャン開始
        this.barcodeScanner.scan().then(data => {

            console.log("Scan successful: " + data.text);

            switch (this.GLOBAL_INPUT_FLG.Global_inputflg) {
                //棚番入力
                case this.F_01_IN_MENU_ID.input_flg_Tanaban:
                    //20180912 ANHLD EDIT START
                    //this.txtTanaban = "";
                    this.txtTanabanInput.value = data.text;
                    //20180912 ANHLD EDIT END

                    this.In_txtTanaban_Scanned();
                    break;

                //品番入力
                case this.F_01_IN_MENU_ID.input_flg_Hinban:
                    //20180912 ANHLD EDIT START
                    //this.txttxtHinban = "";
                    this.txtHinbanInput.value = data.text;
                    //20180912 ANHLD EDIT END
                    this.In_txtHinban_Scanned();
                    break;

                default:
                    break;
            }

        }, (err) => {
            console.log("Scan Unsuccessful: " + err);
        });
    }

    //********************************************************************************
    //メイン画面
    //********************************************************************************
    In_Menu() {

        switch (this.GLOBAL_INPUT_FLG.Global_inputflg) {
            case this.F_01_IN_MENU_ID.input_flg_BackToMenu:
                break;

            //棚番入力
            case this.F_01_IN_MENU_ID.input_flg_Tanaban:
                this.In_Tanaban();
                break;

            //品番入力
            case this.F_01_IN_MENU_ID.input_flg_Hinban:
                this.In_Hinban();
                break;

            //数量入力
            case this.F_01_IN_MENU_ID.input_flg_Suryo:
                this.In_Suryo();
                break;

            //ログ書き込み
            case this.F_01_IN_MENU_ID.input_flg_Write:
                break;

            default:
                break;
        }
    }

    //********************************************************************************
    //棚番入力
    //********************************************************************************
    In_Tanaban() {
        //20180926 ANHLD EDIT START
        //this.txtTanabanInput.setFocus();
        IsDispOperation.isSetFocus(this.txtTanabanInput);
        //20180926 ANHLD EDIT END
    }
    txtTanaban_GotFocus() {
        Global.CurrentControl = this.txtTanabanInput; //20180926 ANHLD ADD

        //この処理と違うテキストボックスからタッチされた場合、行き先を再設定【重要】
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Tanaban;
        this.GLOBAL_INPUT_FLG.Global_prevflg = this.F_01_IN_MENU_ID.input_flg_BackToMenu;
        this.GLOBAL_INPUT_FLG.Global_nextflg = this.F_01_IN_MENU_ID.input_flg_Hinban;
    }
    //20180926 ANHLD ADD START
    async txtTanaban_LostFocus() {
        var itemJson = null;

        if (this.txtTanabanInput.value.length == 0 ) return;

        IsDispOperation.IsWaitMessageBox(this.loadingCtrl, "データ送信中", true);

        //Trans data
        itemJson = await this.In_TransTanaban();

        if (itemJson == null || itemJson.length == 0) {
            IsDispOperation.IsWaitMessageBox(this.loadingCtrl, "データ送信中", false);
            await IsDispOperation.IsMessageBox(this.alertCtrl, "該当しない棚番です", "エラー", "OK", "");
            await IsDispOperation.isSetFocus(this.txtTanabanInput);
            this.txtTanabanInput.value = "";
            return;
        }

        IsDispOperation.IsWaitMessageBox(this.loadingCtrl, "データ送信中", false, Global.CurrentControl);

        this.lblTanamei = itemJson[0].t_location_name;       
        this.isTanaHidden = false;
    }
    //20180926 ANHLD ADD END
    //*********************************************************
    //* バーコードスキャン後
    //*********************************************************
    In_txtTanaban_Scanned() {
        //入力チェック
        if (this.In_txtTanaban_InputCheck() == false) {
            //20180912 ANHLD EDIT START
            //this.txtTanaban = "";
            this.txtTanabanInput.value = "";
            //20180912 ANHLD EDIT END
            return;
        }

        this.GLOBAL_INPUT_FLG.Global_inputflg = this.GLOBAL_INPUT_FLG.Global_nextflg;
        this.In_Menu();
    }
    //*********************************************************
    //* 入力チェック
    //*********************************************************
    In_txtTanaban_InputCheck() {
        var ret = false;

        //桁数チェック
        //20180912 ANHLD EDIT START
        //if (this.txtTanaban.length == 0 || this.txtTanaban.length > 32) {
        //    //NG
        //    return ret;
        //}

        if (this.txtTanabanInput.value.length == 0 || this.txtTanabanInput.value.length > 32) {
            //NG
            return ret;
        }
        //20180912 ANHLD EDIT eND

        //OK
        ret = true;
        return ret;
    }

    //********************************************************************************
    //品番入力
    //********************************************************************************
    In_Hinban() {
        //20180926 ANHLD EDIT START
        //this.txtHinbanInput.setFocus();
        IsDispOperation.isSetFocus(this.txtHinbanInput);
        //20180926 ANHLD EDIT END
    }
    txtHinban_GotFocus() {
        Global.CurrentControl = this.txtHinbanInput; //20180926 ANHLD ADD

        //この処理と違うテキストボックスからタッチされた場合、行き先を再設定【重要】
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Hinban;
        this.GLOBAL_INPUT_FLG.Global_prevflg = this.F_01_IN_MENU_ID.input_flg_Tanaban;
        this.GLOBAL_INPUT_FLG.Global_nextflg = this.F_01_IN_MENU_ID.input_flg_Suryo;
    }
    //20180926 ANHLD ADD START
    async txtHinban_LostFocus() {
        var itemJson = null;

        if (this.txtHinbanInput.value.length == 0) return;
        IsDispOperation.IsWaitMessageBox(this.loadingCtrl, "データ送信中", "OK", true);

        //Trans data
        itemJson = await this.In_TransHinban();

        if (itemJson == null || itemJson.length == 0) {
            console.log('111');
            IsDispOperation.IsWaitMessageBox(this.loadingCtrl, "データ送信中", false);
            await IsDispOperation.IsMessageBox(this.alertCtrl, "該当しない品番です", "エラー", "OK", "");
            await IsDispOperation.isSetFocus(this.txtHinbanInput);
            this.txtHinbanInput.value = "";
            return;
        }

        IsDispOperation.IsWaitMessageBox(this.loadingCtrl, "データ送信中", false, Global.CurrentControl);

        this.lblHinmei = itemJson[0].t_field2;
        this.isHinmeiHidden = false;
    }
    //20180926 ANHLD ADD END
    //*********************************************************
    //* バーコードスキャン後
    //*********************************************************
    In_txtHinban_Scanned() {
        //入力チェック
        if (this.In_txtHinban_InputCheck() == false) {
            //20180912 ANHLD EDIT START
            //this.txtHinban = "";
            this.txtHinbanInput.value = "";
            //20180912 ANHLD EDIT END
            return;
        }

        this.GLOBAL_INPUT_FLG.Global_inputflg = this.GLOBAL_INPUT_FLG.Global_nextflg;
        this.In_Menu();
    }
    //*********************************************************
    //* 入力チェック
    //*********************************************************
    In_txtHinban_InputCheck() {
        var ret = false;

        //桁数チェック
        //20180912 ANHLD EDIT START
        //if (this.txtHinban.length == 0 || this.txtHinban.length > 7089) {
        //    //NG
        //    return ret;
        //}

        if (this.txtHinbanInput.value.length == 0 || this.txtHinbanInput.value.length > 7089) {
            //NG
            return ret;
        }
        //20180912 ANHLD EDIT END

        //OK
        ret = true;
        return ret;
    }

    //********************************************************************************
    //数量入力
    //********************************************************************************
    In_Suryo() {
        //20180926 ANHLD EDIT START
        //this.txtSuryoInput.setFocus();
        IsDispOperation.isSetFocus(this.txtSuryoInput);
        //20180926 ANHLD EDIT END
    }
    txtSuryo_GotFocus() {
        Global.CurrentControl = this.txtSuryoInput; //20180926 ANHLD ADD

        //この処理と違うテキストボックスからタッチされた場合、行き先を再設定【重要】
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Suryo;
        this.GLOBAL_INPUT_FLG.Global_prevflg = this.F_01_IN_MENU_ID.input_flg_Hinban;
        this.GLOBAL_INPUT_FLG.Global_nextflg = this.F_01_IN_MENU_ID.input_flg_Write;

        //キーボード表示
        Keyboard.show(); // for android
        //setTimeout(() => {
        //    Keyboard.show() // for android
        //    this.txtSuryoInput.setFocus();
        //}, 150);
    }
    //*********************************************************
    //* バーコードスキャン後
    //*********************************************************
    In_txtSuryo_Scanned() {
        //入力チェック
        if (this.In_txtSuryo_InputCheck() == false) {
            //20180912 ANHLD EDIT START
            //this.txtSuryo = "";
            this.txtSuryoInput.value = "";
            //20180912 ANHLD EDIT END
            return;
        }

        //数字チェック
        //20180912 ANHLD EDIT START
        //if (this.isNumber(this.txtSuryo) == false) {
        //    this.txtSuryo = "";
        //    return;
        //}

        if (this.isNumber(this.txtSuryoInput.value) == false) {
            this.txtSuryoInput.value = "";
            return;
        }
        //20180912 ANHLD EDIT END

        this.GLOBAL_INPUT_FLG.Global_inputflg = this.GLOBAL_INPUT_FLG.Global_nextflg;
        this.In_Menu();
    }
    //*********************************************************
    //* 入力チェック
    //*********************************************************
    In_txtSuryo_InputCheck() {
        var ret = false;

        //桁数チェック
        //20180912 ANHLD EDIT START
        //if (this.txtSuryo.length == 0 || this.txtSuryo.length > 10) {
        //    //NG
        //    return ret;
        //}

        if (this.txtSuryoInput.value.length == 0 || this.txtSuryoInput.value.length > 10) {
            //NG
            return ret;
        }
        //20180912 ANHLD EDIT END

        //OK
        ret = true;
        return ret;
    }
    //********************************************************************************
    //数値判定
    //********************************************************************************
    isNumber(val) {
        var regex = new RegExp(/^[-+]?[0-9]+(\.[0-9]+)?$/);
        return regex.test(val);
    }
    //********************************************************************************
    //データ確定
    //********************************************************************************
    async In_WriteLog() {
        //通信
        //20180926 ANHLD ADD START
        var ret = await this.Write_Trans();

        if (ret == -1) {
            IsDispOperation.IsWaitMsgBoxMoment(this.toastCtrl, "エラー", 'bottom', 1000);
            return;
        }
        //20180926 ANHLD ADD START

        //メッセージ
        IsDispOperation.IsWaitMsgBoxMoment(this.toastCtrl, "登録されました", 'bottom', 1000);

        //20180912 ANHLD EDIT START
        //this.txtHinban = "";
        //this.txtSuryo = "";

        this.txtHinbanInput.value = "";
        this.txtSuryoInput.value = "";
        this.lblHinmei = "";
        this.isHinmeiHidden = true;
        //20180912 ANHLD EDIT END

        //20180926 ANHLD ADD END
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.GLOBAL_INPUT_FLG.Global_nextflg;
        this.In_Menu();
        //20180926 ANHLD ADD START
    }

    //********************************************************************************
    //確定ボタン
    //********************************************************************************
    async cmdRegist_Click(event:any) //20180912 ANHLD EDIT [add -> (async)]
    {
        //入力チェック

        //棚番 -------------------------------------------------------------
        if (this.In_txtTanaban_InputCheck() == false) {
            //20180912 ANHLD EDIT START
            //IsDispOperation.IsMessageBox(this.alertCtrl, "棚番の桁数が不正です", "エラー", "OK", "");
            await IsDispOperation.IsMessageBox(this.alertCtrl, "棚番の桁数が不正です", "エラー", "OK", "");
            await IsDispOperation.isSetFocus(this.txtTanabanInput, Keyboard);
            //20180912 ANHLD EDIT END

            return;
        }
        //棚番 -------------------------------------------------------------

        //品番 -------------------------------------------------------------
        if (this.In_txtHinban_InputCheck() == false) {
            //20180912 ANHLD EDIT START
            //IsDispOperation.IsMessageBox(this.alertCtrl, "品番の桁数が不正です", "エラー", "OK", "");
            await IsDispOperation.IsMessageBox(this.alertCtrl, "品番の桁数が不正です", "エラー", "OK", "");
            await IsDispOperation.isSetFocus(this.txtHinbanInput);
            //20180912 ANHLD EDIT END
            return;
        }
        //品番 -------------------------------------------------------------

        //数量 -------------------------------------------------------------
        if (this.In_txtSuryo_InputCheck() == false) {
            //20180912 ANHLD EDIT START
            //IsDispOperation.IsMessageBox(this.alertCtrl, "数量の桁数が不正です", "エラー", "OK", "");
            await IsDispOperation.IsMessageBox(this.alertCtrl, "数量の桁数が不正です", "エラー", "OK", "");
            await IsDispOperation.isSetFocus(this.txtSuryoInput);
            //20180912 ANHLD EDIT END
            return;
        }
        //数量 -------------------------------------------------------------

        //この処理と違うテキストボックスからタッチされた場合、行き先を再設定【重要】
        this.GLOBAL_INPUT_FLG.Global_inputflg = this.F_01_IN_MENU_ID.input_flg_Write;
        this.GLOBAL_INPUT_FLG.Global_prevflg = this.F_01_IN_MENU_ID.input_flg_Suryo;
        this.GLOBAL_INPUT_FLG.Global_nextflg = this.F_01_IN_MENU_ID.input_flg_Hinban;

        //確定
        this.In_WriteLog();
    }

    //20180926 ANHLD ADD START
    //********************************************************************************
    //
    //********************************************************************************
    fnc_DirSep_Add(path: string): string {
        var res = "";
        res = path;

        if (res.lastIndexOf('/') != res.length - 1) {
            res = res + '/';
        }

        return res;
    }

    //********************************************************************************
    //棚番要求
    //********************************************************************************
    async In_TransTanaban(): Promise<any> {
        var apiUri = null;
        var headersReq = null;
        var options = null;
        var strLocationName = "";

        //apiUri = 'https://hsccloud-a522913.db.us2.oraclecloudapps.com/apex/hscdevelop/zaiko/api';
        apiUri = await IsIniOperation.IsIniRead(Global.T_SETINI, 'API_URL');
        
        //Check URI is empty
        if (apiUri == null || apiUri == "") return;

        apiUri = this.fnc_DirSep_Add(apiUri);
        apiUri += 'loca-req' + '?';
        apiUri += 'T_LOCATION_ID=' + this.txtTanabanInput.value;

        //Set header
        headersReq = new Headers({
            'Content-Type': 'application/json'
        });
        //Set option
        options = new RequestOptions({ headers: headersReq });

        return new Promise((resolve, reject) => {
            this.http.get(apiUri, options)
                .subscribe((data) => {
                    var jsonItem = JSON.parse(data['_body'])
                    resolve(jsonItem['items']);

                }, (error) => {
                    alert('エラー' + '\n' + error);
                    resolve(null);
                });
        });
    }

    //********************************************************************************
    //品番要求
    //********************************************************************************
    async In_TransHinban(): Promise<any> {
        var apiUri = null;
        var headersReq = null;
        var options = null;
        var strLocationName = "";

        //apiUri = 'https://hsccloud-a522913.db.us2.oraclecloudapps.com/apex/hscdevelop/zaiko/api';
        apiUri = await IsIniOperation.IsIniRead(Global.T_SETINI, 'API_URL');

        //Check URI is empty
        if (apiUri == null || apiUri == "") return;

        apiUri = this.fnc_DirSep_Add(apiUri);
        apiUri += 'item-req' + '?';
        apiUri += 'T_FIELD1=' + this.txtHinbanInput.value;

        //Set header
        headersReq = new Headers({
            'Content-Type': 'application/json'
        });

        //Set option
        options = new RequestOptions({ headers: headersReq });

        return new Promise((resolve, reject) => {
            this.http.get(apiUri, options)
                .subscribe((data) => {
                    var jsonItem = JSON.parse(data['_body'])
                    resolve(jsonItem['items']);

                }, (error) => {
                    alert('エラー' + '\n' + error);
                    resolve(null);
                });
        });
    }

    //********************************************************************************
    //要求
    //********************************************************************************
    async Write_Trans() : Promise<any> {
        var apiUri = null;

        //apiUri = 'https://hsccloud-a522913.db.us2.oraclecloudapps.com/apex/hscdevelop/zaiko/api';
        apiUri = await IsIniOperation.IsIniRead(Global.T_SETINI, 'API_URL');

        //Check URI is empty
        if (apiUri == null || apiUri == "") return;

        apiUri = this.fnc_DirSep_Add(apiUri);
        apiUri += 'dcmp-cmp' + '?';
        apiUri += 'T_MODE=' + Global.g_mode;
        apiUri += '&T_PIC=' + Global.g_Tanto;
        apiUri += '&T_LOCATION_ID=' + this.txtTanabanInput.value;
        apiUri += '&T_FIELD1=' + this.txtHinbanInput.value;
        apiUri += '&T_VALUE=' + this.txtSuryoInput.value;
    
        return new Promise((resolve, reject) => {
            this.http.put(apiUri, null)
                .subscribe((data) => {
                    if (data['status'] == 200) {
                        resolve(0);
                    }
                    else {
                        resolve(-1);
                    }
                }, (error) => {
                    //alert('エラー2' + '\n' + error);
                    resolve(-1);
                });
        });        
    }
    //20180926 ANHLD ADD END
}
