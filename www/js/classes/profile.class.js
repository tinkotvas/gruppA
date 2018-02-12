class Profile extends Base {
    constructor(nav) {
        super();
        this.nav=nav;
    }

    get email() {
        return `${this.usName}`;
    }

    get password() {
        return `${this.pass}`;
    }

    set email(val) {
        //email address control
        val = val.split('@');
        if (val.length == 2) {
            // user name as JSON file name
            this.usName = val[0];
            this.web = val[1];
            $(".signUpEmail").parent().removeClass("has-warning");
            // $(".signupbtn").prop("disabled", false);
            $(".lginEmail").parent().removeClass("has-warning");
        }
        else {
            $(".lginEmail").parent().addClass("has-warning");
            $(".signUpEmail").parent().addClass("has-warning");
            // $(".signupbtn").prop("disabled", true);
        }
    }

    set password(val) {
        if (this.validate(val)) {
            this.pass = val;
            $(".passControl").addClass("d-none");
            $(".signupbtn").prop("disabled", false);
        } else {
            $(".signupbtn").prop("disabled", true);
        }
    }

    keyuplogin(event) {
        if ($(event.target).hasClass('lginEmail')) {
            this.email = $(".lginEmail").val();
        }
        if ($(event.target).hasClass('lgPass')) {
            this.password = $(".lgPass").val();
        }
    }

    keyupsignup(event) {
        if ($(event.target).hasClass('signUpEmail')) {
            this.email = $(".signUpEmail").val();
        }
        if ($(event.target).hasClass('signUpPass')) {
            this.password = $(".signUpPass").val();
        }
        if ($(event.target).hasClass('signUpRePass')) {
            this.repass = $(".signUpRePass").val();
        }
    }

    changelogin(event) {
        if ($(event.target).hasClass('lginEmail')) {
            this.email = $(".lginEmail").val();
         }
        if ($(event.target).hasClass('lgPass')) {
            this.password = $(".lgPass").val();
        }
    }

    changesignup(event) {
        if ($(event.target).hasClass('signUpEmail')) {
            this.email = $(".signUpEmail").val();
        }
        if ($(event.target).hasClass('signUpPass')) {
            this.password = $(".signUpPass").val();
        }
        if ($(event.target).hasClass('signUpRePass')) {
            this.repass = $(".signUpRePass").val();
        }
    }


    clicklogin(event, element, instance) {

        if ($(event.target).hasClass('lgin')) {
            this.checkLogin(this.usName);   
        }
    }

    checkLogin(jsonName, callbackFunc) {
        // Looking for JSON file name as this.usName
        try {
            JSON._load(jsonName).then((data) => {
                if (data.password == this.password) {
                    callbackFunc && callbackFunc();
                    this.login();
                    $('#loginModal').modal('toggle');
                } else {
                    $('.loginFail').removeClass('d-none');
                }
            });
        }
        catch (e) {
            //User name not found
            $('.noUserName').removeClass('d-none');
        }
    }
    login() {
        let that = this;
        console.log(that.email);
        console.log(that.password);
        app.getCurrentUser(that.usName);
        that.nav.showUSname();
        JSON._save('currentUser', { userName: that.usName });
       $('#loginForm')[0].reset();  
    }

    clicksignup(event, element, instance) {
        if ($(event.target).hasClass('cancelbtn')) {
            $('#signupModal').modal('toggle');
        }
        if ($(event.target).hasClass('signupbtn')) {
            this.sign();
        }
    }

    sign() {
        if (this.checkPass()) {
            try {
                JSON._save(this.usName, { email: this.email, password: this.password });
                this.login();
                $('#signupModal').modal('toggle');
                $('#signupForm')[0].reset();
            }
            catch (e) {
                alert("System fail!");
            }
        }
    }

    checkPass() {
        //check passwords
        if (this.password !== this.repass) {
            $('.repassCheck').removeClass('d-none');
            // $(".signupbtn").prop("disabled", true);
            return false;
        }else if (!$('.tAndP').prop('checked')) {
            //check box
            $('.checkIt').removeClass('d-none');
            return false;
        }else{
            return true;
        }
    }

    validate(password) {
        return /(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)\w{6,}$/.test(password);
    }

   

    toggleLoginModal() {
        let that = this;
        that.render('.modal-container-login', 'login');
        $('#loginModal').modal('toggle');
        
    }

    toggleSignupModal() {
        let that = this;
        that.render('.modal-container-signup', 'signup');
        $('#loginModal').modal('toggle');
        $('#signupModal').modal('toggle');
    }
}