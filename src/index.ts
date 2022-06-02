'use strict';

import start_httpServer from './connections/http'
import connect_mongoServer from './connections/mongo'
import { connect_redisServer } from './connections/redis'
import * as dotenv from 'dotenv'
dotenv.config({path: '.env'})

start_httpServer()
connect_mongoServer()
connect_redisServer()


    

   