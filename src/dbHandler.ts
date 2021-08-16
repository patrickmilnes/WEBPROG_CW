import { Pool } from 'pg';
import config from './config';

/**
 * Pool to query postgres database.
 */
 const pool = new Pool(config);

 /**
  * Queries database for example questionnaire.
  */
export async function queryDb() {
     try {
         const results = await pool.query("select questionnaire_json from questionnaire where questionnaire_name = 'Example Questionnaire'");
         return results.rows[0];
     } catch (error) {
         console.log(error);
     }
 }
 
 /**
  * Insets results data from questionnire into database.
  * @param {JSON} data -> JSON string containing results.
  */
export async function pushToDb(data: any) {
     try {
         await pool.query("insert into results (questionnaire_id, results_json) values (1, '" + data + "')");
     } catch (error) {
         console.log(error);
     }
 }
 
export async function queryResults() {
     try {
         const results = await pool.query("select results_json from results where questionnaire_id='1'");
         return results;
     } catch (error) {
         console.log(error);
     }
 }
 
 