/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-04-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/

    public with sharing class LeadController {
        @AuraEnabled(cacheable=true)
        public static List<Lead> getLeads() {
            return [SELECT Id, Name, Phone, Email,LeadSource, Dur_e_d_assurance__c, Type_d_assurance__c, Company, Nombre_d_employ_s__c FROM Lead];
        }

        public LeadController() {

        }


        @AuraEnabled
        public static void deleteLead(String leadId) {
            try {
                delete new Lead(Id = leadId);
            } catch(Exception e) {
                throw new AuraHandledException('Erreur lors de la suppression du lead : ' + e.getMessage());
            }
        }


        @AuraEnabled(cacheable=true)
        public static List<Lead> searchLeads(String searchKey) {
            String searchTerm = '%' + searchKey + '%'; // Ajoute des wildcards pour rechercher des correspondances partielles
            return [SELECT Id, Name,Status, Phone, Email,LeadSource, Dur_e_d_assurance__c, Type_d_assurance__c, Company, Nombre_d_employ_s__c
                    FROM Lead
                    WHERE Name LIKE :searchTerm and  Status != 'Closed - Converted' ];
        }

       
    }
    


