
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class DivA extends NavigationMixin(LightningElement) {
    handleButtonClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/URL_DE_LA_NOUVELLE_PAGE'
            }
        });
    }
}
