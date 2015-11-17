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
, appName: "Pos Laju Tracking API"
, hostname: null
, port: 4000
, workers: 2

, model: {
    defaultAdapter: 'mongo'
  }

/*  
, db: {
    mongo: {
      username: 'poslajutrackinguser'
    , dbname: 'poslajutracking'
    , prefix: null
    , password: 'poslajutrackinguserpro'
    , host: '128.199.218.200'
    , port: 27017
    }
  }
*/

, db: {
    mongo: {
      username: ''
    , dbname: ''
    , prefix: null
    , password: ''
    , host: ''
    , port: 10094
    }
  }


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


