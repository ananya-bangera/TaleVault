# TaleVault
## Inspiration
TaleVault a decentralised ecosystem that fosters collaboration and co-creation among writers, artists, and content creators from diverse backgrounds and locations. It emphasizes the potential for unique partnerships, and the development of innovative POVs.

## What it does

TaleVault  rises the potential for creators to directly engage with their audience, build a loyal following, and capture value from their work. The platform empowers creators to monetize their work directly by minting their narratives as non-fungible tokens (NFTs). Before submiting their narratives creators can opt for the network they want to receive their cryptos in, the amount and genre for their POV. The tokens metadata are triggered as events which is continously listened by `TheGraph` Client. Futher the View POVs section presents those tokens which are not bought by any publisher after fetching from TheGraph.

These tokenized stories are then listed on the platform's decentralized marketplace, where interested publishers can purchase them using USDC tokens. Usually the publishers are on the Polygon Amoy network and they transfer their USDC tokens to the creator to the network, creator has earlier opted for, via `Chainlink CCIP Routing Mechanism`. When the equivalent amount is received by the creator they can release the NFT with which the ownership is now transfered to the publisher. Once a story or creative concept is purchased, the new owner gains the rights to develop that narrative into various forms of content, such as videos or animations. 

These publishers can sign in to `Lens Profile` and enable their profile manager. Once done they can now follow other publishers , view and post contents and comment on other's posts. To post a content , the publisher has to first select the corresponding NFT (POV) followed by the file(video/animation). Now the file gets uploaded to IPFS and then the CID of the file, metadata of the POV are passed as attributes to generate a content metadata. This metadata is pinned to IPFS using the pinata `PinToIPFS` service which then returns a contentURI. The contentURI is posted on chain using lens `postOnchain` method. This would create a `Lens Publications - Post` corresponding to the publishers lens profile.

Now the viewers after loging in with their lens handle can view those contents. They can also post their comments and view the actual documented POV in markdown format. Further, they can vote for their favorite content, thereby incentivizing the publisher as well as the creator of the content.

The platform fosters a community-driven ecosystem where creators and audiences can participate in governance, decision-making, and shaping the future of the platform through a decentralized autonomous organization (DAO) structure.

## How we built it

### Chainlink CCIP
 The creator can choose the network on which they want to get their corresponding USDC amount for their NFTs, say Avalanche Fuji. Further when the publisher, on Polygon Amoy, pays for the NFT the CCIP routing service is used to bridge the tokens. There by ensuring that the creator receives the token on network of their choice.
 
CCIP transaction link: [https://ccip.chain.link/msg/0x650cf8d1e3c0113dbf6ce05177c2d0475fdbe552e8d8152032239637c6559f95](https://ccip.chain.link/msg/0x650cf8d1e3c0113dbf6ce05177c2d0475fdbe552e8d8152032239637c6559f95)

### Lens Protocol
The entire social media ecosystem runs on top of Lens Protocol. The publishers create a profile and login using their lens handle , say `0x025a`. Here we have integrated profile manager as it facilitates both gasless and signless transactions.
 
Further, the publisher uploads a file ( video / animation) for the content publication and attach the NFT as a reference to the script. This is released as  `lens Publications` and can be viewed in the profile the section of the corresponding user. 

Once the content is uploaded it can be watched by the viewers. Additionally they can comment on the publication using `lens Comments`.

Thus the entire ecosystem is tied together using `Lens Protocol`

## Challenges we ran into

1. **CCIP Integration with Hardhat**: We faced several issues while importing the libraries into Hardhat and deploying it. But then with the help of Chainlink docs, we figured out the network configurations and packages required like `@chainlink/contracts` and `@chainlink/contracts-ccip`.
2. **Lens  Client**: The docs pointed `@lens-client@alpha`,  which was an older lens client. We noticed it was using polygon mumbai , which is now deprecated. So we checked out the npm repository, to find `@lens-client@latest` was the one for amoy.
3. **Lens Profile Manager**: Earlier, we weren't aware that we need to activate the Lens manager to follow or create publications. But later on some more research and deep diving into the `Lens - Docs : Gasless and Signless` we learnt that we must opt-in to using the dispatcher, so before processing a transaction, we must check whether their profile has the functionality enabled.
4. **Lens PostOnChain**: To submit a publication as a post we need to generate a contentURI, which we earlier misinterpreted to be file IPFS URI. But later we realised we need to pin the metadata to IPFS and attach the URI of metadata instead of content itself.

## Accomplishments that we're proud of

1. We integrated chainlink CCIP, Lens Protocol and TheGraph end-to-end in our project.
2. Although we had our end semester exams during this period, but we managed to schedule our time accordingly and finally we are ready with a fully functional project to submit!

## What we learned
1. CCIP Routing Mechanisms not only theoretically but also practically. Building a entire project using CCIP, helped us to understand it in better terms.
2. Although many social media ecosystems exist on Web2, but learning about a protocol that serves all those seamless features on web3 was quite interesting. Also lens was pretty easy to integrate, which makes it again more handy to automate the desired social media experience on any platform.

## What's next for TaleVault

1. Enabling creators to collaborate with AI models, generate unique narrative elements, or even create entirely new forms of interactive and dynamic storytelling experiences.
2. Introducing decentralized crowdfunding and patronage mechanisms, allowing publishers to raise funds for their projects directly from their audience. This could foster a stronger connection between publishers and supporters, while providing an alternative funding model for creative projects.
3. Looking into the technical aspects, right now the transactions are serially occuring but batching of all the transactions that needs to be triggered in one go can be enabled.
4. Betting can be conducted by allowing multiple publishers to post content targeting to the same NFT(POV). The one which receives a higher amount of votes recieves a larger portion of the betting pool. This would develop a competitive atmosphere as well as better means to attract the crowd and get  a larger number of followers.

## 🛠Project Setup

To get TaleVault run locally, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ananya-bangera/TaleVault.git
cd .\talevault\
yarn
cd .\packages\nextjs\
yarn
```

2. Start your NextJS app:

```
yarn start
```


## 👩‍💻Contributors

Team Members

- [Sarvagnya Purohit](https://github.com/saRvaGnyA) 
- [Ananya Bangera](https://github.com/ananya-bangera) 
- [Harsh Nag](https://github.com/Jigsaw-23122002) 
