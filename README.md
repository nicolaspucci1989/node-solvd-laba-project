### Solvd Laba Project

### Topic
**Financial Institutions** (banks, exchanges, financial companies)  
The question is: how much money can I take, based on my salary, in what currency, for how much, how much interest per year.
### Endpoint documentation
#### GET /loan, this could be a POST request (a loan record should be created if the loan is granted).
The user request a loan, the load is granted or declined base on the user's financial status (salary, credit, etc..)
#### GET /balance
Return how much money the user has, and the currency of the balance.
#### POST /withdraw/{amount}
The user requests a withdraw of money, if the user does not have enough money an error is return.
#### GET /invest?amount={amount}?time={time}
The user requests the interest rate for the given amount of money and the given duration of time.
