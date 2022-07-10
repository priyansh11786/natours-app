const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures')

exports.deleteOne = model => catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id)

    if (!doc) return next(new AppError('No document exsits with such a id', 404));

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!doc) return next(new AppError('There has been some problem in updating', 404));

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) return next(new AppError('There has been a problem in creating the document'))

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {

        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions)
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    })

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filters = {};
    if(req.params.tourId) filters = {tour : req.params.tourId}

    //Executing API query
    const features = new APIFeatures(Model.find(filters), req.query)
                    .filter()
                    .sort()
                    .limit()
                    .paginate()
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        data: {
            data : doc
        }
    })
})

