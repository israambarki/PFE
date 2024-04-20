/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-19-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class assuredperson {
    public assuredperson() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAssured() {
        return [SELECT Id,Name,Email, tat__c,Phone,AccountId FROM Contact   WHERE tat__c LIKE 'Assuré(e)'];
    }
    @AuraEnabled
    public static void deletecontact(String opp) {
        try {
            delete new Contact(Id = opp);
        } catch(Exception e) {
            throw new AuraHandledException('Erreur lors de la suppression du lead : ' + e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchcontact(String searchKey) {
        String searchTerm = '%' + searchKey + '%'; // Ajoute des wildcards pour rechercher des correspondances partielles
        return [SELECT Id,Name,Email, tat__c,Phone,Accounts__c
                FROM Contact
                WHERE Name LIKE :searchTerm and tat__c LIKE 'Assuré(e)'];
    }


    @AuraEnabled
        public static void importContacts(String csvData) {
            List<Contact> contactsToInsert = new List<Contact>();
           
            // Split CSV data by newline characters to get each row
            List<String> csvRows = csvData.split('\n');
           
            // Iterate through each row (excluding header if present)
            for (Integer i = 1; i < csvRows.size(); i++) {
                String[] csvValues = csvRows[i].split(',');
               
                // Assuming CSV format: Name,Title,AccountName
                if (csvValues.size() == 4) {
                    Contact newContact = new Contact();
                    newContact.FirstName = csvValues[0].trim();
                    newContact.LastName = csvValues[1].trim();
                    newContact.Email = csvValues[2].trim();
                    newContact.AccountId = getAccountId(csvValues[3].trim()); // Get AccountId based on Account Name
                    newContact.tat__c = 'Assuré(e)';


                    contactsToInsert.add(newContact);
                }
            }
           
            // Insert contacts
            insert contactsToInsert;
        }
       
        // Helper method to get AccountId based on Account Name
        private static Id getAccountId(String accountName) {
            Account acc = [SELECT Id FROM Account WHERE Name = :accountName LIMIT 1];
            return (acc != null) ? acc.Id : null;
        }



           @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account LIMIT 10];
    }




    
    @AuraEnabled
    public static void importContactsnew(String csvData, Id accountId) {
        // Convert CSV data to list of contacts
        List<Contact> contactsToInsert = new List<Contact>();
        List<String> csvRows = csvData.split('\n');
        for(Integer i=1; i<csvRows.size(); i++) {
            List<String> csvValues = csvRows[i].split(',');
            if(csvValues.size() == 5) { // Assuming 5 columns in CSV: FNAME,LNAME,EMAIL,Account,etat
                Contact newContact = new Contact(
                    FirstName = csvValues[0],
                    LastName = csvValues[1],
                    Email = csvValues[2],
                    AccountId = accountId, // Assign the selected account Id
                    tat__c = csvValues[4] // Assuming 'etat' is a custom field on Contact object
                );
                contactsToInsert.add(newContact);
            }
        }
        insert contactsToInsert;
    }



}