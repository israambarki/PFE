import { LightningElement,api } from 'lwc';
export default class Map extends LightningElement {

        // Définir les marqueurs de carte pour Talan Tunisie
        @api mapMarkers = [{
            location: {
                Latitude:  36.836063230912245,
                Longitude: 10.21002172916114
            },
       
            title: 'CareShieldsHealth Assurance'
        }];
     
        // Définir le centre de la carte sur la localisation de Talan Tunisie
        /*@api mapCenter = {
            location: {
                Latitude: 36.898163,
                Longitude: 10.189644
            }
        };*/
         // Méthode pour centrer la carte sur la localisation de l'entreprise
    connectedCallback() {
        this.template.querySelector('lightning-map').setCenter(this.mapMarkers[0].location);
    }
    }




