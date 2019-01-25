const {Browser, By, Key, until} = require("selenium-webdriver");

class InitWizardPage {

    constructor(driver) {

        this.driver = driver;
        this.url = 'http://leyka-test.kandinsky.tmweb.ru/wp-login.php?redirect_to=http%3A%2F%2Fleyka-test.kandinsky.tmweb.ru%2Fwp-admin%2Fadmin.php%3Fpage%3Dleyka_settings_new%26screen%3Dwizard-init%26reset%3D1&reauth=1';
        this.test_account_login = 'leyka_tester';
        this.test_account_pass = '19851308cdCDyENT,leyka-test';

        this.locators = {
            wp_login_form: By.id('loginform'),
            wp_login: By.id('user_login'),
            wp_pass: By.id('user_pass'),
            wp_login_submit: By.id('wp-submit'),
            navigation_area: By.css('.nav-area'),
            receiver_country_field: By.id('leyka_receiver_country-field'),
            receiver_type_field: function(type_value){
                return By.css('input[name="leyka_receiver_legal_type"][value="'+type_value+'"]');
            },
            wizard_step_submit: By.css('.step-submit input[name="leyka_settings_submit_init"]'),
        };

    }

    open() {
        this.driver.get(this.url);
    }

    async loginIntoWizardPage() {

        let wp_login_form = await this.driver.findElements(this.locators.wp_login_form);

        if(wp_login_form.length > 0) { // Login needed - checking

            let login_field = await this.driver.wait(until.elementLocated(this.locators.wp_login)),
                pass_field = await this.driver.wait(until.elementLocated(this.locators.wp_pass)),
                submit = await this.driver.wait(until.elementLocated(this.locators.wp_login_submit));

            await login_field.sendKeys(this.test_account_login);
            await this.driver.sleep(100);
            await pass_field.sendKeys(this.test_account_pass);
            await this.driver.sleep(100);
            await submit.click();
            await this.driver.sleep(100);

        }

    }

    async isNavigationAreaInState(section_name_to_check, step_name_to_check) {

        section_name_to_check = section_name_to_check.length ? section_name_to_check.toString() : '';
        step_name_to_check = step_name_to_check.length ? step_name_to_check.toString() : '';

        let active_section = await this.driver
            .findElement(this.locators.navigation_area)
            .findElements(By.css('.nav-section.active'));

        if( !active_section.length && section_name_to_check.length ) {
            return false;
        } else {
            active_section = active_section[0];
        }

        let real_section_name = await active_section.findElement(By.css('.nav-section-title')).getText();
        if(section_name_to_check.length && !real_section_name.includes(section_name_to_check)) {
            return false;
        }

        let active_step = await active_section.findElements(By.css('.nav-steps .nav-step.active'));
        if( !step_name_to_check.length && !active_step.length ) { // Don't need to check
            return true;
        } if( !active_step.length && step_name_to_check.length ) {
            return false;
        } else if(active_step.length && !step_name_to_check.length) {
            return false;
        } else {
            active_step = active_step[0];
        }

        let real_step_name = await active_step.getText();
        if(step_name_to_check.length && !real_step_name.includes(step_name_to_check)) {
            return false;
        }

        return true;

    }

    async selectReceiverCountry(country_value) {

        await this.driver.findElement(this.locators.receiver_country_field)
            .findElement(By.css('option[value="' + country_value + '"]'))
            .click();

    }

    async selectReceiverType(type_value) {

        await this.driver
            .findElement(this.locators.receiver_type_field(type_value))
            .click();

    }

    async submitStep() {
        await this.driver.findElement(this.locators.wizard_step_submit).click();
    }

}

module.exports = InitWizardPage;