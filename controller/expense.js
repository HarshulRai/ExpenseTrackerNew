const Expense = require('../models/expenses');
const UserServices = require('../services/userservices')
const S3Service = require('../services/S3serviec')


const downloadexpense = async(req, res) => {
    try{
        const expenses = await UserServices.getExpenses(req);
    const stringifiedExpenses = JSON.stringify(expenses);
    
    const userId = req.user.id;
    
    
    const filename = `expense${userId}/${new Date()}.txt`;
    const fileUrl = await S3Service.uploadtoS3(stringifiedExpenses, filename);
    
    
    res.status(200).json({ fileUrl, success: true } )
    } catch(err) {
        res.status(500).json({fileUrl: '', success:false, err: err })
    }
    

}

const addexpense = (req, res) => {
    const { expenseamount, description, category } = req.body;
    req.user.createExpense({ expenseamount, description, category }).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {

    req.user.getExpenses().then(expenses => {
        return res.status(200).json({expenses, success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: { id: expenseid }}).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    downloadexpense,
    
}