/* eslint-disable no-alert */
// leadList.js

import { LightningElement, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Lead.Name';
import Status from '@salesforce/schema/Lead.Status';


import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import Company from '@salesforce/schema/Lead.Company';
import Nombre_employés from '@salesforce/schema/Lead.Nombre_d_employ_s__c';
import Type_assurance from '@salesforce/schema/Lead.Type_d_assurance__c';
import Durée_assurance from '@salesforce/schema/Lead.Dur_e_d_assurance__c';
import leadsource from '@salesforce/schema/Lead.LeadSource'

import deleteLead from '@salesforce/apex/LeadController.deleteLead';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import { NavigationMixin } from 'lightning/navigation';




import searchLeads from '@salesforce/apex/LeadController.searchLeads';
const COLUMNS = [
    { label: 'Lead Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Status', fieldName: Status.fieldApiName, type: 'text' },
    { label: 'Company', fieldName: Company.fieldApiName, type: 'text' },

    { label: 'Nombre d\'\employés', fieldName: Nombre_employés.fieldApiName, type: 'text' },
    { label: 'Type d\'\assurance', fieldName: Type_assurance.fieldApiName, type: 'text' },
    { label: 'Durée d\'\assurance', fieldName: Durée_assurance.fieldApiName, type: 'text' },
    { label: 'lead source', fieldName: leadsource.fieldApiName, type: 'text' },

    

    { label: 'Phone', fieldName: PHONE_FIELD.fieldApiName, type: 'phone' },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'email' },

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

export default class LeadListTab extends NavigationMixin(LightningElement) {
    columns = COLUMNS;
    searchKey = '';
    @wire(searchLeads, { searchKey: '$searchKey' })
    leadsearch;
    handleSearchKeyChange(event) {
        this.searchKey = event.target.value;
    }





   /* @wire(getLeads)
    leads;*/
    selectedLead = null;

    get errors() {
        return (this.leadsearch.error) ?
            reduceErrors(this.leadsearch.error) : [];
    }

    //New
    handleCreateRecord() {
        // Navigate to the record creation page for the desired object
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Lead',
                actionName: 'new'
            }
        });
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
                this.deleteLead(row.Id);
                break;
                case 'modify_lead':
                    this.handleAction(row.Id, 'edit');   
               // this.modifyLead(row.Id);
                break;
            default:
                break;
        }
    }


    stat() {
        // Incrémentez le nombre d'opportunités modifiées
    
        window.location.href = '/lightning/n/Rapport_de_nos_Leads';//ouverture dans la meme fenetre
   }

   handleAction(recordId, mode) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: recordId,
            objectApiName: 'Lead',
            actionName: mode
        }
    })
}

   /* modifyLead(opp) {
        // Incrémentez le nombre d'opportunités modifiées
    
       window.location.href = '/lightning/r/Lead/' + opp + '/edit?count=1&backgroundContext=%2Flightning%2Fr%2FLead%2F'+ opp +'%2Fview';//ouverture dans la meme fenetre
   }*/

    viewLeadDetails(leadId) {
        //window.open('/lightning/r/Lead/' + leadId + '/view', '_blank');//ouverture dans une nouvelle tab
        window.location.href = '/lightning/r/Lead/' + leadId + '/view';//ouverture dans la meme fenetre
    }

    
    deleteLead(leadId) {

        // Afficher une boîte de dialogue de confirmation
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) {
        deleteLead({ leadId: leadId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lead supprimé avec succès.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.leadsearch);
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
    }


    handleDownloadCSV() {
        const csvData = this.leadsearch.data.map(lead => ({
            'Lead Name': lead.Name,
            'Phone': lead.Phone,
            'Email': lead.Email,

            'Lead Status': lead.Status,
            'Entreprise': lead.Company,
            'Durée assurance': lead.Durée_assurance,
            'Type assurance': lead.Type_assurance,
            'Nombre employés': lead.Nombre_employés
            

        }));

        exportCSV(this.columns, csvData, 'LeadList');
    }
    



// telecharger sous forme CSV !!! 
    async downloadCSV() {
        const { data } = this.leadsearch;

        if (!data || data.length === 0) {
            this.showToast('Error', 'No data to download', 'error');
            return;
        }

        const csvContent = this.convertArrayOfObjectsToCSV(data);
        this.downloadCSVFile(csvContent, 'LeadList.csv');
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
