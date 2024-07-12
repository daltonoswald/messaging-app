const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { format } = require('date-fns')
const User = require('../models/user');