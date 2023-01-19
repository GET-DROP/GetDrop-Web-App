const express = require('express')//1.i we create a route for our pages here with router and export to app.js
const router = express.Router()
const app = express();
const { ensureAuth } = require('../middleware/auth')
const AirDrop = require('../models/airdrops')

// description show add page
// route GET /airdrops/add

router.get('/add', ensureAuth, (req, res) => {
    res.render('airdrops/add')
})

// description process the add form 
// route POST /airdrops
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await AirDrop.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// decription show all airdrops
//route GET /airdrops
router.get('/', ensureAuth, async (req, res) => {
    try {
        const airdrops = await AirDrop.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('airdrops/index', {
            airdrops,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// description show edit page
// route GET /airdrops/edit/:id

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const airdrops = await AirDrop.findOne({
            _id: req.params.id
        }).lean()

        if (!airdrops) {
            return res.render('error/404')
        }
        if (airdrops.user != req.user.id) {
            res.redirect('/airdrops')
        } else {
            res.render('airdrops/edit', {
                airdrops,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// description update airdrops
// route PUT /airdrops/:id

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let airdrops = await AirDrop.findById(req.params.id).lean()

        if (!airdrops) {
            return res.render('error/404')
        }

        if (airdrops.user != req.user.id) {
            res.redirect('/airdrops')
        } else {
            airdrops = await AirDrop.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })
            res.redirect('/dashboard')
        }
    }
    catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// description delete story
// route DELETE /airdrops/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await AirDrop.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})
// description show single airdrop
// route GET /airdrops/:id

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let airdrops = await AirDrop.findById(req.params.id)
            .populate('user')
            .lean()
        if (!airdrops) {
            return res.render('error/404')
        }
        res.render('airdrops/show',{ airdrops})
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



module.exports = router