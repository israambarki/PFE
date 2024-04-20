import { LightningElement,wire } from 'lwc';




// leadList.js


import NAME_FIELD from '@salesforce/schema/Contact.Name';
import email from '@salesforce/schema/Contact.Email';
import etat from '@salesforce/schema/Contact.tat__c';
import Aname from '@salesforce/schema/Contact.Accounts__c'

import phone from '@salesforce/schema/Contact.Phone'
import importContacts from '@salesforce/apex/assuredperson.importContacts';
import deletecontact from '@salesforce/apex/assuredperson.deletecontact';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { NavigationMixin } from 'lightning/navigation';

import searchcontact from '@salesforce/apex/assuredperson.searchcontact';




const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: email.fieldApiName, type: 'text' },
    { label: 'State', fieldName: etat.fieldApiName, type: 'text' },
    { label: 'Phone', fieldName: phone.fieldApiName, type: 'text' },
    { label: 'Account Name', fieldName: Aname.fieldApiName, type: 'text' },
    
    

    

//actions:
{ label: 'Voir Details', type: 'button', typeAttributes: { label: 'Voir Details', name: 'view_details', variant: 'base' } },
{ label: 'Action', type: 'button', typeAttributes: { label: 'Supprimer', name: 'delete_lead', variant: 'destructive' } },
{ label: 'Modifier', type: 'button', typeAttributes: { label: 'Modifier', name: 'modify_lead', variant: 'brand' } }

    

];

export default class Assuredperson extends NavigationMixin(LightningElement)  {
    columns = COLUMNS;
    
    searchKey = '';


    isModalOpen = false;
    accountOptions = []; // Placeholder for account options
    selectedAccountId = ''; // Placeholder for selected account id
    csvData = ''; // Placeholder for CSV file data

    
    
    
    @wire(searchcontact, { searchKey: '$searchKey' })
    Contactsearch;
    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }



// Déclarez une variable pour stocker le nombre d'opportunités modifiées


   /* @wire(getLeads)
    leads;*/
    selectedLead = null;

    get errors() {
        return (this.Contactsearch.error) ?
            reduceErrors(this.Contactsearch.error) : [];
    }


  //New
  handleCreateRecord() {
    // Navigate to the record creation page for the desired object
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Contact',
            actionName: 'new'
        }
    });
}


handleImportContacts() {
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            objectApiName: 'Lead',
            actionName: 'import'
        }
    });
}





importCSV(event) {
    const fileInput = this.template.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const csvData = reader.result;
            importContacts({ csvData })
                .then(result => {
                    // Display success message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contacts imported successfully.',
                            variant: 'success'
                        })
                    );
                    // Refresh the contact list
                    return refreshApex(this.Contactsearch);
                })
                .catch(error => {
                    // Display error message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        };
        reader.readAsText(file);
    } else {
        // Display error message if no file selected
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Please select a CSV file to import.',
                variant: 'error'
            })
        );
    }
}


    
    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
       

        switch (action.name) {
            case 'view_details':
               // this.viewLeadDetails(row.Id);
               
               this.handleAction(row.Id, 'view');
               break;
            case 'delete_lead':
                this.deleteContact(row.Id);
                break;
                case 'modify_lead':
                    this.handleAction(row.Id, 'edit');   
                   // this.deleteContact(row.Id);
                    break;
            default:
                break;
        }
    }


    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Contact',
                actionName: mode
            }
        })
    }
    

    modifyOpportunity(opp) {
         // Incrémentez le nombre d'opportunités modifiées
     
        window.location.href = '/lightning/r/Opportunity/' + opp + '/edit?count=1&backgroundContext=%2Flightning%2Fr%2FOpportunity%2F'+ opp +'%2Fview';//ouverture dans la meme fenetre
    }


    viewLeadDetails(opp) {
        //window.open('/lightning/r/Lead/' + leadId + '/view', '_blank');//ouverture dans une nouvelle tab
        window.location.href = '/lightning/r/Opportunity/' + opp + '/view';//ouverture dans la meme fenetre
    }

    
    deleteContact(c) {
        deletecontact({ cont: c })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact supprimé avec succès.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.Contactsearch);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }


    handleDownloadCSV() {
        const csvData = this.Contactsearch.data.map(opp => ({
            'Opportunity Name': opp.name,
            'Phone': opp.Amount,
            'Email': opp.Pack
        }));

        exportCSV(this.columns, csvData, 'OpportunityList');
    }
    



// telecharger sous forme CSV !!! 
    async downloadCSV() {
        const { data } = this.Contactsearch;

        if (!data || data.length === 0) {
            this.showToast('Error', 'No data to download', 'error');
            return;
        }

        const csvContent = this.convertArrayOfObjectsToCSV(data);
        this.downloadCSVFile(csvContent, 'OpportunityList.csv');
    }

    convertArrayOfObjectsToCSV(data) {
        const csvHeader = Object.keys(data[0]).join(',');
        const csvRows = data.map(row => Object.values(row).join(','));
        return csvHeader + '\n' + csvRows.join('\n');
    }

    downloadCSVFile(csvContent, fileName) {
        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName;
        hiddenElement.click();
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }

}
