import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Card extends NavigationMixin(LightningElement) {
   

        @api imageSrc;
        @api cardText;
        @api soustext;
    
        @api pageUrl;

        handleCardClick() {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: this.pageUrl
                }
            });
        }

}
