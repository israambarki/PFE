// leadList.js

import { LightningElement, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import Amount from '@salesforce/schema/Opportunity.Amount';
import closed from '@salesforce/schema/Opportunity.CloseDate';
import Aname from '@salesforce/schema/Opportunity.AccountId'

import Pack from '@salesforce/schema/Opportunity.StageName'

import deleteOpp from '@salesforce/apex/Opportunitygetter.deleteOpp';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import { NavigationMixin } from 'lightning/navigation';






import getOpp from '@salesforce/apex/Opportunitygetter.getOpp';
import searchopp from '@salesforce/apex/Opportunitygetter.searchopp';

const COLUMNS = [
    { label: 'Opportunity Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Amount', fieldName: Amount.fieldApiName, type: 'currency' },
    { label: 'close date', fieldName: closed.fieldApiName, type: 'date' },
    { label: 'Account Name', fieldName: Aname.fieldApiName, type: 'text' },
    { label: 'StageName', fieldName: Pack.fieldApiName, type: 'text' },
    

    

//actions:
{ label: 'View Details', type: 'button', typeAttributes: { label: 'View Details', name: 'view_details', variant: 'base',  title: 'View', disabled: false, value: 'view', iconPosition: 'left',  iconName:'utility:preview'} },
{ label: 'Action', type: 'button', typeAttributes: { label: 'Supprimer', name: 'delete_lead', variant: 'destructive' , title: 'Supprimer',
disabled: false,
value: 'delete',
iconPosition: 'left',
iconName:'utility:delete',} },
{ label: 'Modifier', type: 'button', typeAttributes: { 
    label: 'Modifier', name: 'modify_lead', variant: 'brand', title: 'Modifier',
    disabled: false,
    value: 'modifier',
    iconPosition: 'left',
    iconName:'utility:edit' } }
    

];

export default class opplist extends  NavigationMixin(LightningElement) {
    columns = COLUMNS;
    
    searchKey = '';

    
    @wire(searchopp, { searchKey: '$searchKey' })
    Oppsearch;
    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }




       //New
       handleCreateRecord() {
        // Navigate to the record creation page for the desired object
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Opportunity',
                actionName: 'new'
            }
        });
    }

// Déclarez une variable pour stocker le nombre d'opportunités modifiées


   /* @wire(getLeads)
    leads;*/
    selectedLead = null;

    get errors() {
        return (this.Oppsearch.error) ?
            reduceErrors(this.Oppsearch.error) : [];
    }


    
    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
       

        switch (action.name) {
            case 'view_details':
                //this.viewLeadDetails(row.Id);
                
                this.handleAction(row.Id, 'view');
                break;
            case 'delete_lead':
                this.deleteOpportunity(row.Id);
                break;
                case 'modify_lead':
                    this.handleAction(row.Id, 'edit');   
                   // this.modifyOpportunity(row.Id);
                    break;
            default:
                break;
        }
    }

    modifyOpportunity(opp) {
         // Incrémentez le nombre d'opportunités modifiées
     
        window.location.href = '/lightning/r/Opportunity/' + opp + '/edit?count=1&backgroundContext=%2Flightning%2Fr%2FOpportunity%2F'+ opp +'%2Fview';//ouverture dans la meme fenetre
    }

    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Opportunity',
                actionName: mode
            }
        })
    }
    viewLeadDetails(opp) {
        //window.open('/lightning/r/Lead/' + leadId + '/view', '_blank');//ouverture dans une nouvelle tab
        window.location.href = '/lightning/r/Opportunity/' + opp + '/view';//ouverture dans la meme fenetre
    }

    
    deleteOpportunity(leadId) {
        deleteOpp({ leadId: leadId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Opportunity supprimé avec succès.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.Oppsearch);
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
        const csvData = this.Oppsearch.data.map(opp => ({
            'Opportunity Name': opp.name,
            'Phone': opp.Amount,
            'Email': opp.Pack
        }));

        exportCSV(this.columns, csvData, 'OpportunityList');
    }
    



// telecharger sous forme CSV !!! 
    async downloadCSV() {
        const { data } = this.Oppsearch;

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
