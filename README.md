
To test code:

1: Open a command prompt or shell terminal after install node.js.

2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session (index.js)

4: Instantiate blockchain with blockchain variable
```
let bc = new Blockchain();
```

5: Generate 10 blocks using a for loop
```
bc.addBlock(new Block('test1')).then(()=>{return bc.addBlock(new Block('test2'))}).then(()=>{return bc.addBlock(new Block('test3'))}).then(()=>{return bc.addBlock(new Block('test4'))}).then(()=>{return bc.addBlock(new Block('test5'))}).then(()=>{return bc.addBlock(new Block('test6'))}).then(()=>{return bc.addBlock(new Block('test7'))}).then(()=>{return bc.addBlock(new Block('test8'))}).then(()=>{return bc.addBlock(new Block('test9'))});
```
6: Validate blockchain
```
bc.validateChain().then( (v)=> console.log(v)).catch((e)=>console.log(e));
```

7: Induce errors by changing block data
```
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
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
bc.validateChain().then( (v)=> console.log(v)).catch((e)=>console.log(e));
```

9: get block:
bc.getBlock(0,(err,block)=>console.log(block))

