const level = require('level')
const chainDB = './chainData'
const db = level(chainDB, { valueEncoding: 'json' });

////
function InduceErrorsToBlock(blockHeight, error) {
    return new Promise((resolve, reject) => {
        db.get(`block${blockHeight}`, (err, block) => {
            if (err) reject(err)
            else {
                block.body = error;
                db.put(`block${blockHeight}`, block, (err) => {
                    if (err) reject(err)
                    else resolve(`block${blockHeight} induced`)
                })
            }
        })
    })
}
function deleteAllBlocksAndBlockHieght() {
    const level = require('level')
    const chainDB = './chainData'
    const db = level(chainDB, { valueEncoding: 'json' });
    let i = 0;
    db.get('blockchainHeight', (err, val) => {
        if (err) console.log(err)
        else {
            for (i = 0; i <= val; i++) {
                db.del(`block${i}`, (err) => {
                    if (err) console.log(err)
                })
            }
            db.del('blockchainHeight', (err) => {
                if (err) console.log(err)
            })
        }
    })
}

function getBlock(blockHeight){
    db.get(`block${blockHeight}`, (err, block) => {
        if (err) console.log(err)
        return console.log( JSON.parse(JSON.stringify(block)) )
    })
}
function getBlockx(blockHeight){
    db.get(`block${blockHeight}`, (err, block) => {
        if (err) console.log(err)
        return JSON.parse(JSON.stringify(block))
    })
}
function getBlockcahinHeight() {
    db.get('blockchainHeight', (err, height) => {
        if (err) console.log(err)
        else console.log(height)
    })
}

function readDb(){
    // const level = require('level')
    // const chainDB = './chainData'
    // const db = level(chainDB, { valueEncoding: 'json' });
    db.createReadStream().on('data', function(data) {
        console.log(data)
      }).on('error', function(err) {
          return console.log('Unable to read data stream!', err)
      }).on('close', function() {
      });
}

// /bc.validateBlock(0).then( (v)=> console.log(v))
bc.validateBlock(1).then( (v)=> console.log(v))
let bc = new Blockchain();

bc.addBlock(new Block('test1')).then(()=>{return bc.addBlock(new Block('test2'))}).then(()=>{return bc.addBlock(new Block('test3'))}).then(()=>{return bc.addBlock(new Block('test4'))}).then(()=>{return bc.addBlock(new Block('test5'))}).then(()=>{return bc.addBlock(new Block('test6'))}).then(()=>{return bc.addBlock(new Block('test7'))}).then(()=>{return bc.addBlock(new Block('test8'))}).then(()=>{return bc.addBlock(new Block('test9'))});

bc.validateChain().then( (v)=> console.log(v)).catch((e)=>console.log(e));

function InduceErrorsToBlock(blockHeight, error) {
    return new Promise((resolve, reject) => {
        db.get(`block${blockHeight}`, (err, block) => {
            if (err) reject(err)
            else {
                block.body = error;
                db.put(`block${blockHeight}`, block, (err) => {
                    if (err) reject(err)
                    else resolve(`block${blockHeight} induced`)
                })
            }
        })
    })
}
InduceErrorsToBlock(2,'hello')
InduceErrorsToBlock(4,'hello')
InduceErrorsToBlock(7,'hello')

bc.validateChain().then( (v)=> console.log(v)).catch((e)=>console.log(e));



// function demo() {
//     //clear
//     let blockchain = new Blockchain();

//     setTimeout(() => {
//         let seq = Promise.resolve();
//         let i = 0;
//         for (i = 0; i < 10; i++) {
//             seq = seq.then((v) => {
//                 console.log('blockchain add block', v)
//                 return blockchain.addBlock(new Block("test data " + i));
//             }).catch((e) => {
//                 console.log(e)
//             })
//         }
//         seq = seq.then((v) => {
//             console.log(v)
//             return blockchain.validateChain();
//         }).catch((e) => {
//             console.log(e)
//         })
//         let inducedErrorBlocks = [2, 4, 7];

//         for (i = 0; i < inducedErrorBlocks.length; i++) {
//             seq = seq.then(() => {
//                 console.log(`inducedErrorBlocks[${i}]`, inducedErrorBlocks[i])
//                 return InduceErrorsToBlock(inducedErrorBlocks[i], 'induced chain error')
//             }).catch((e) => {
//                 console.log(e)
//             })
//         }
//         seq = seq.then(() => {
//             return blockchain.validateChain()
//         }).catch((e) => {
//             console.log(e)
//         });
//         seq.then((v) => {
//             console.log(v)
//         }).catch((e) => {
//             console.log(e)
//         });
//     }, 3000)
// }
// demo()