/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256')
//leveldb
const level = require('level')
const chainDB = './chainData'
const db = level(chainDB, { valueEncoding: 'json' });
// Block Class
class Block {
    constructor(data) {
        this.hash = ''
        this.height = 0
        this.body = data
        this.time = 0
        this.previousBlockHash = ''
    }
}
// Blockchain Class
class Blockchain {
    constructor() {
        let blockchain = this;
        blockchain.getBlockcahinHeight((err, height) => {
            if (err) {
                blockchain.addBlock(new Block('First block in the chain - Genesis block')).then((v) => {
                    console.log(v)
                }).catch((e) => { console.log('error', e) })
            }
            else {
                console.log('Genesis block already exist')
            }
        })
    }

    async addBlock(newBlock) {
        //CHECK IF persist
        // console.log(this.getBlock(0))
        let blockchain = this;
        //if no genisi will get error 
        let genesisBlock = await blockchain.getBlockSync(0);
        if (genesisBlock == undefined) {
            newBlock.height = 0;
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            // newBlock.previousBlockHash = ''
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            let block = await blockchain.putBlockSync(newBlock, newBlock.height);
            return 'Genesis Block Added:' + JSON.parse(JSON.stringify(newBlock));
        }
        else {
            let blockchainHeight = await blockchain.getBlockcahinHeightSync();
            newBlock.height = blockchainHeight + 1;
            newBlock.previousBlockHash = await blockchain.getPreviousBlockHashSync(newBlock.height)
            newBlock.time = new Date().getTime().toString().slice(0, -3);
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            let block = await blockchain.putBlockSync(newBlock, newBlock.height);
            return 'Block Added:' + JSON.parse(JSON.stringify(newBlock));
        }
    }
    //get block by height
    //helper method returning a promise
    getBlockWrapper(blockHeight) {
        //return promise
        return new Promise((resolve, reject) => {
            db.get(`block${blockHeight}`, (err, block) => {
                if (err) reject(err)
                else resolve(block)
            })
        })
    }
    async  getBlockSync(blockHeight) {
        try {
            let block = await this.getBlockWrapper(blockHeight);
            return block
        } catch (err) {
            return undefined
        }
    }
    getBlock(blockHeight) {
        //return promise
        db.get(`block${blockHeight}`, (err, block) => {
            if (err) console.log(err)
            else return block
        })
    }

    //get blockchain height
    //this is getBlockHeight
    getBlockcahinHeightWrapper() {
        //return promise
        return new Promise((resolve, reject) => {
            db.get(`blockchainHeight`, (err, blockchainHeight) => {
                if (err) reject(err)
                else resolve(blockchainHeight)
            })
        })
    }
    //used in add block
    async  getBlockcahinHeightSync() {
        try {
            let blockchainHeight = await this.getBlockcahinHeightWrapper();
            return blockchainHeight
        } catch (err) {
            return undefined;
        }
    }
    //used in constrctor
    getBlockcahinHeight(cb) {
        db.get('blockchainHeight', (err, height) => {
            if (err) cb(err)
            else cb(null, height)
        })
    }

    // get Previous Block Hash
    getPreviousBlockHashWrapper(blockHeight) {
        //return promise
        return new Promise((resolve, reject) => {
            db.get(`block${blockHeight - 1}`, (err, block) => {
                if (err) reject(err)
                else resolve(block.hash)
            })
        })
    }
    async  getPreviousBlockHashSync(blockHeight) {
        try {
            let blockHash = await this.getPreviousBlockHashWrapper(blockHeight);
            return blockHash
        } catch (err) {
            return undefined
        }
    }
    getPreviousBlockHash(blockHeight, cb) {
        db.get(`block${blockHeight - 1}`, (err, block) => {
            if (err) cb(err)
            else cb(null, block.hash)
        })
    }
    //add block to the chain
    async putBlockSync(block, height) {
        db.put('blockchainHeight', height, (err) => {
            db.put(`block${height}`, block, (err) => {
                if (err) throw new Error(err)
                else return ''
            })
        })
    }
    async validateBlock(blockHeight) {
        let block = await this.getBlockSync(blockHeight);
        let blockHash = block.hash;
        block.hash = ''
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        if (blockHash === validBlockHash) {
            return true;
        } else {
            console.log('\nBlock #' + blockHeight + ' invalid hash:')
            console.log('\x1b[36m%s\x1b[0m', 'should be:' + blockHash);
            console.log('\x1b[31m%s\x1b[0m', 'found after validating:' + validBlockHash);
            return false;
        }
    }
    //
    // Validate blockchain
    async validateChain() {
        let errorLog = [];
        let chainHight = await this.getBlockcahinHeightSync();
        for (var i = 0; i <= chainHight; i++) {
            // validate block
            let validBlock = await this.validateBlock(i);
            if (!validBlock) {
                errorLog.push(i);
            }
            //dont compare blocks hash link for last block
            if (i != chainHight) {
                // compare blocks hash link
                let block = await this.getBlockSync(i);
                let blockHash = block.hash
                let nextBlock = await this.getBlockSync(i + 1);
                let previousHash = nextBlock.previousBlockHash;
                if (blockHash !== previousHash) {
                    errorLog.push(i);
                }
            }
        }
        if (errorLog.length > 0) {
            // console.log('Block errors = ' + errorLog.length);
            // console.log('Blocks: ' + errorLog);
            throw new Error('In blocks:' + errorLog);
        } else {
            // console.log('No errors detected');
            return 'No errors detected'
        }
    }
}