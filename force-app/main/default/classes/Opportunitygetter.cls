/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-01-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class Opportunitygetter {
    public Opportunitygetter() {

    }


    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpp() {
        return [SELECT Id,Name, Amount, CloseDate,StageName,AccountId FROM Opportunity];
    }
    @AuraEnabled
    public static void deleteOpp(String opp) {
        try {
            delete new Opportunity(Id = opp);
        } catch(Exception e) {
            throw new AuraHandledException('Erreur lors de la suppression du lead : ' + e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> searchopp(String searchKey) {
        String searchTerm = '%' + searchKey + '%'; // Ajoute des wildcards pour rechercher des correspondances partielles
        return [SELECT Id,Name, Amount, CloseDate,StageName,AccountId
                FROM Opportunity
                WHERE Name LIKE :searchTerm];
    }



    @AuraEnabled(cacheable=false)
    public static String modifyOpp(String opportunityId, String newName) {
        try {
            Opportunity opp = [SELECT Id, Name FROM Opportunity WHERE Id = :opportunityId];
            opp.Name = newName;
            update opp;
            return 'Success';
        } catch(Exception e) {
            System.debug('Erreur lors de la modification de l\'opportunité : ' + e.getMessage());
            throw new AuraHandledException('Une erreur est survenue lors de la modification de l\'opportunité.');
        }
    }

}


