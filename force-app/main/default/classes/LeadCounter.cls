/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-04-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class LeadCounter {
    public LeadCounter() {

    }


    
        @AuraEnabled(cacheable=true)
        public static Integer getLeadCount() {
            return [SELECT COUNT() FROM Lead];
        }
    
    
}