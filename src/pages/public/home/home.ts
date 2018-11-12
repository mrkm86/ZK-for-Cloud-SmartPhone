//プラグイン/モジュールなど ---------------------------------------------------------
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

//HEARTIS関数 -----------------------------------------------------------------------
import { IsDispOperation } from '../../../inc/IsDispOperation';

//共通ページ ------------------------------------------------------------------------

//個別ページ ------------------------------------------------------------------------
import { NyukoPage } from '../../private/nyuko/nyuko';
//20180924 ANHLD ADD START
import { IsIniOperation } from '../../../inc/IsIniOperation';
import { Global } from '../../../inc/Global';
//20180924 ANHLD ADD END

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    //メニュー一覧
    MENUINFO =
        [
            {
                menu: "NYUKO",
                DispTitle: "入庫処理",
                icon: "arrow-round-forward",
                color: "NYUKOSEL"
            },
            {
                menu: "SYUKO",
                DispTitle: "出庫処理",
                icon: "arrow-round-back",
                color: "SYUKOSEL"
            },
            {
                menu: "TANAOROSI",
                DispTitle: "棚卸処理",
                icon: "md-clipboard",
                color: "TANASEL"
            }
        ]

    //20180924 ANHLD ADD START
    private loginUser: string = "";
    private loginPassword: string = "";
    //20180924 ANHLD ADD END

    constructor(
        public alertCtrl: AlertController,
        public navCtrl: NavController) {

    }

    //メニューを開く
    async openPage(val: String) { //20180912 ANHLD EDIT [add -> (async)]
        switch (val) {
            case "NYUKO":
                //20180924 ANHLD ADD START
                this.loginUser = await IsIniOperation.IsIniRead(Global.T_SETINI, 'LOGIN_USER');
                this.loginPassword = await IsIniOperation.IsIniRead(Global.T_SETINI, 'PASSWORD');

                if (this.loginUser == "" || this.loginPassword == "") {
                    await IsDispOperation.IsMessageBox(this.alertCtrl, "ログイン情報が登録されていません", "エラー", "OK", "");
                    return;
                }
                //20180924 ANHLD ADD END
                //20180926 ANHLD ADD START
                Global.g_Tanto = this.loginUser;
                Global.g_mode = "1";
                //20180926 ANHLD ADD END
                this.navCtrl.push(NyukoPage, { index: val });
                break;

            case "SYUKO":
                this.navCtrl.push(NyukoPage, { index: val });
                break;

            case "TANAOROSI":
                //20180912 ANHLD EDIT START
                //var strAnswer = IsDispOperation.IsMessageBox(this.alertCtrl, "どうしますか！？", "エラー", "YESNO", "");
                var strAnswer = await IsDispOperation.IsMessageBox(this.alertCtrl, "どうしますか！？", "エラー", "YESNO", "");
                //20180912 ANHLD EDIT END
                alert(strAnswer);
                //this.navCtrl.push(NyukoPage, { index: val });
                break;
        }
    }
}
