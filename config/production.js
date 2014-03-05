/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var config = {
  detailedErrors: false
, hostname: null
, port: 4000
, workers: 1

, model: {
    defaultAdapter: 'mongo'
  }
  
, db: {
    mongo: {
      username: 'alifaziz'
    , dbname: 'poslajutracking'
    , prefix: null
    , password: '12345678'
    , host: 'emma.mongohq.com'
    , port: 10094
    }
  }

// mongo emma.mongohq.com:10094/poslajutracking -u <user> -p<password>  
  
/*
 // Using Postgres as the default, with only a Postgres DB
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: 'alifaziz'
    , database: 'poslajutracking'
    , password: 'athirah89'
    , host: 'filavents.com'
    , port: 5432
    }
  }
*/

/* // Using Postgres as the default, with both Postgres and Riak
, model: {
    defaultAdapter: 'postgres'
  }
, db: {
    postgres: {
      user: process.env.USER
    , database: process.env.USER
    , password: null
    , host: null
    , port: 5432
    }
  , riak: {
      protocol: 'http'
    , host: 'localhost'
    , port: 8098
  }
  }
*/
};

module.exports = config;


