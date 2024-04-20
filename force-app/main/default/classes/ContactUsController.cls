/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-20-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class ContactUsController {



    public ContactUsController() {


    }

   @AuraEnabled
    public static void createContactUsRecord(String name, String email, String message) {
       
        Contacter_Nous__c contactUsRecord = new Contacter_Nous__c();
        contactUsRecord.Name = name;
        contactUsRecord.Email__c = email;
        contactUsRecord.Message__c = message;
        insert contactUsRecord;
    }
}