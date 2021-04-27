# Smile-Squad

## Planning

- We are going to meet everyday at 9:00 pm at Remo
- Discuss our progress, and the requriment.

## Deliverable

### Conflict Plan

- Resovling Conflict:

  - When a conflict arise we all going to meet and resolve it.

  - We all going to contribute equally, and we going to make that happen

  - We are going to discuss the functionality and check to new branch and solve it.

### Communication Plan

- We are going to communicate via Slack and Whatsapp

- We are going to make a vote on every features and functionality

- we are going to make sure everyone will speak if something happen

### Work Plan

- Using Trello and GitHub project board to assign task and everyong complete their assignment.

- Trello.

### Git Process

- Our API that will be consumed by our frontend.

- Using GitHub Orginaiztion.

- We will use the PR review:
  - Two will be reviewing the PR and confirm the merge.
  - The team leader
  - It depends on the workflow.
  - If the PR get approved we will merge it.


## Routes Documentation 

#### User's Routes:
1. POST `/api/v1/players/:id/addFriend` >> bearer 
* INPUT: username
* OUTPUT: allow the user to add a specific friend 


``{
    "active": true,
    "gamePlayed": 0,
    "gameWin": 0,
    "winRatio": 0,
    "friendList": [
        "6087273ba82a6d03a47e8db6"
    ],
    "reportsNumbers": 0,
    "reports": [],
    "role": "user",
    "_id": "6087273ba82a6d03a47e8db6",
    "username": "subhi",
    "password": "$2b$10$FJ9lEpGARlkFxbyWAyITwO.gGpvg.EaUoZ/HZQnCo4aOa1gpkxAM.",
    "email": "subhi@hotmail.com",
    "__v": 0
}``

2. POST `/api/v1/players/:id/removeFriend` >> bearer 
* INPUT: username
* OUTPUT: allow the user to remove a specific friend 
{
    "active": true,
    "gamePlayed": 0,
    "gameWin": 0,
    "winRatio": 0,
    "friendList": [],
    "reportsNumbers": 0,
    "reports": [],
    "role": "user",
    "_id": "6087273ba82a6d03a47e8db6",
    "username": "subhi",
    "password": "$2b$10$FJ9lEpGARlkFxbyWAyITwO.gGpvg.EaUoZ/HZQnCo4aOa1gpkxAM.",
    "email": "subhi@hotmail.com",
    "__v": 1
}

3. GET `/api/v1/players/:id/friends` >> bearer 
* INPUT: username
* OUTPUT: allow the user to get the names of his friends
[
    "subhi"
]

4. GET `/profile` >> bearer 
* INPUT: -
* OUTPUT: allow to show the user his account 

Welcome to Smile Squad game <username>

5. GET `/api/v1/search/:username` >> bearer 
* INPUT: email or username
* OUTPUT: allow the user to search on another user by email or username

[
    {
        "active": true,
        "gamePlayed": 0,
        "gameWin": 0,
        "winRatio": 0,
        "friendList": [],
        "reportsNumbers": 0,
        "reports": [],
        "role": "user",
        "_id": "608726f9a82a6d03a47e8db5",
        "username": "Ahmad",
        "password": "$2b$10$Mu2luCsN4p6c2f7kMyymeOYmESVIOfD8WCNLG5NNlwMqaVoXvZP.C",
        "email": "baha@hotmail.com",
        "__v": 0
    }
]

6. POST `/api/v1/report/player/:username` >> bearer 
* INPUT: message
* OUTPUT: allow the user to report for another user

{
    "active": true,
    "gamePlayed": 0,
    "gameWin": 0,
    "winRatio": 0,
    "friendList": [
        "6087273ba82a6d03a47e8db6"
    ],
    "reportsNumbers": 1,
    "reports": [
        {
            "name": "subhi",
            "msg": "this player ..................."
        },
        
    ],
    "role": "user",
    "_id": "6087273ba82a6d03a47e8db6",
    "username": "subhi",
    "password": "$2b$10$FJ9lEpGARlkFxbyWAyITwO.gGpvg.EaUoZ/HZQnCo4aOa1gpkxAM.",
    "email": "subhi@hotmail.com",
    "__v": 6
}

7. POST `/api/v1/players/game` 
* INPUT: { "gamePlayers":[
             "faten","raghad"
           ],
          "winner":"raghad"
         } 
* OUTPUT: count the points for the players

[
    {
        "active": true,
        "gamePlayed": 2,
        "gameWin": 1,
        "winRatio": 0.5,
        "friendList": [],
        "reportsNumbers": 0,
        "reports": [],
        "role": "admin",
        "_id": "60857e0e5f24870da9711bab",
        "username": "raghad",
        "email": "raghad@gmail.com",
        "password": "$2b$10$dtHeBjBMqv25kz6jiHxaUusBiKOuRqrOz1aWOoqNGJquVlSWZVa1G",
        "__v": 2,
        "posts": [
            {
                "_id": "6085fd70e95f5b038fbca0ee",
                "title": "fatennnnnnnnnnnnnnnnnn",
                "content": "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
                "username": "raghad",
                "__v": 0
            },
            {
                "_id": "608675929a9dab037fddc54b",
                "title": "raghad",
                "content": "hi gays ..............",
                "username": "raghad",
                "__v": 0
            }
        ]
    }
]


8. GET `/api/v1/topPlayers` 
* INPUT: -
* OUTPUT: return the top 5 players by win ratio

[
    {
        "active": true,
        "gamePlayed": 0,
        "gameWin": 0,
        "winRatio": 0.21,
        "friendList": [],
        "reportsNumbers": 0,
        "reports": [],
        "role": "user",
        "_id": "6084b609fd684a11aa340196",
        "email": "youtarawneh997@gmail.com",
        "username": "omar",
        "password": "$2b$10$RUt8XNlXxMFsi4V4Xq2ns.4qndlv5puO5RlODaiHeJ03t6CaaBqcW",
        "imgurl": "empty",
        "__v": 0
    },
    {
        "active": true,
        "gamePlayed": 0,
        "gameWin": 0,
        "winRatio": 0,
        "friendList": [],
        "reportsNumbers": 0,
        "reports": [],
        "role": "user",
        "_id": "60853dee6d5ee304d43a22bb",
        "username": "faten1",
        "email": "faten1@gmail.com",
        "password": "$2b$10$QfYIMI567umvQ6ndAlhj8.I1mrnJvL.fWGaAUj2H4cNPMC9jCUWuC",
        "__v": 33,
        "posts": [
            {
                "_id": "6085d9083b04210eaeadfef5",
                "title": "hello from ",
                "content": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "username": "faten1",
                "__v": 0
            },
            {
                "_id": "6085d90b3b04210eaeadfef6",
                "title": "hello from ",
                "content": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "username": "faten1",
                "__v": 0
            },
            {
                "_id": "6085d90d3b04210eaeadfef7",
                "title": "hello from ",
                "content": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "username": "faten1",
                "__v": 0
            },
            {
                "_id": "6085d9143b04210eaeadfef8",
                "title": "hello from ",
                "content": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "username": "faten1",
                "__v": 0
            },
            {
                "_id": "6085d9848e92780ed59ed897",
                "title": "hello from ",
                "content": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                "username": "faten1",
                "__v": 0
            }
        ]
    },
    {
        "active": true,
        "gamePlayed": 0,
        "gameWin": 0,
        "winRatio": 0,
        "friendList": [
            "60853dee6d5ee304d43a22bb"
        ],
        "reportsNumbers": 0,
        "reports": [],
        "role": "admin",
        "_id": "60857dc95f24870da9711ba9",
        "username": "faten2",
        "password": "$2b$10$jKJwDKh3b8X6y0Ay0ZRDze5AD5XGcwQXTAHHlcPfJPgz2.u/VlQ5G",
        "__v": 123,
        "posts": []
    },
    {
        "active": true,
        "gamePlayed": 0,
        "gameWin": 0,
        "winRatio": 0,
        "friendList": [],
        "reportsNumbers": 0,
        "reports": [],
        "role": "admin",
        "_id": "60857e0e5f24870da9711bab",
        "username": "raghad",
        "email": "raghad@gmail.com",
        "password": "$2b$10$dtHeBjBMqv25kz6jiHxaUusBiKOuRqrOz1aWOoqNGJquVlSWZVa1G",
        "__v": 2,
        "posts": [
            {
                "_id": "6085fd70e95f5b038fbca0ee",
                "title": "fatennnnnnnnnnnnnnnnnn",
                "content": "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
                "username": "raghad",
                "__v": 0
            },
            {
                "_id": "608675929a9dab037fddc54b",
                "title": "raghad",
                "content": "hi gays ..............",
                "username": "raghad",
                "__v": 0
            }
        ]
    },
    {
        "active": true,
        "gamePlayed": 0,
        "gameWin": 0,
        "winRatio": 0,
        "friendList": [],
        "reportsNumbers": 0,
        "reports": [],
        "role": "user",
        "_id": "60858d9d1bc629088193da15",
        "username": "amal",
        "email": "amal@gmail.com",
        "password": "$2b$10$n.zT6.8zcqY2T.GCrbMZi.tWHryNsEbDp/GBoJ8LD5G4jrj0PBvqa",
        "__v": 5,
        "posts": [
            {
                "_id": "6085ff2ae95f5b038fbca0ef",
                "title": "fatennnnnnnnnnnnnnnnnn",
                "content": "fffffffffffff",
                "username": "amal",
                "__v": 0
            },
            {
                "_id": "60860416fc3ffd07019ee577",
                "title": "fatennnnnnnnnnnnnnnnnn",
                "content": "fffffffffdddddddvvvvvvvvvvvddddddddddd",
                "username": "amal",
                "__v": 0
            },
            {
                "_id": "60860473ab5f9007d645b881",
                "title": "fatennnnnnnnnnnnnnnnnn",
                "content": "fffffffffdddddddvvvvvvvvvvvddddddddddd",
                "username": "amal",
                "__v": 0
            },
            {
                "_id": "6086047aab5f9007d645b882",
                "title": "fatennnnnnnnnnnnnnnnnn",
                "content": "fffffffffdddddddvvvvvvvvvvvddddddddddd",
                "username": "amal",
                "__v": 0
            },
            {
                "_id": "6086048bab5f9007d645b883",
                "title": "fatennnnnnnnnnn4444444444444444444nnnnnnn",
                "content": "fffffffffdddddddvvvvvvvvvvvddddddddddd",
                "username": "amal",
                "__v": 0
            }
        ]
    }
]

9. GET `/api/v1/joke` 
* INPUT: -
* OUTPUT: Get random jokes from the jokes API

"Did you hear the one about the guy with the broken hearing aid? Neither did he."
