import { LightningElement, track } from 'lwc';
import createContactUsRecord from '@salesforce/apex/ContactUsController.createContactUsRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class Contacter extends LightningElement {

        @track name = '';
        @track email = '';
        @track message = '';
    
        handleNameChange(event) {
            this.name = event.target.value;
        }
    
        handleEmailChange(event) {
            this.email = event.target.value;
        }
    
        handleMessageChange(event) {
            this.message = event.target.value;
        }
    
        handleSend() {

const n = this.name;
const e = this.email;
const M = this.message;

            createContactUsRecord({ name: n, email: e, message: M })
                .then(result => {
                    // Handle successful insertion
                    console.log('Record inserted successfully: ', result);
                    // Optionally, reset the form fields
                    this.name = '';
                    this.email = '';
                    this.message = '';
                    this.showSuccessToast(); // Afficher la notification de succès
                })
                .catch(error => {
                    // Handle error
                    console.error('Error inserting record: ', error);
                });
        }


        showSuccessToast() {
            const event = new ShowToastEvent({
                title: 'Succès',
                message: 'Le formulaire a été envoyé avec succès',
                variant: 'success'
            });
            this.dispatchEvent(event);
          
        }
    }
    



