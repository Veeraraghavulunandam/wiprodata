#1


select emp.Name
from dbo.tblEmployees emp
where emp.Name not like '%[ ]%'


#2


select emp.Name
from dbo.tblEmployees emp
where emp.Name like '[a-z]%[ ][a-z]%[ ][a-z]%' and emp.Name not like '[a-z]%[ ][a-z]%[ ][a-z]%[ ][a-z]%';


#3


select emp.Name
from dbo.tblEmployees emp
where emp.Name like 'ram[ ]%' or emp.Name like '%[ ]ram' or emp.Name like '%[. ]ram[ ]%';

#4.1

select emp.EmployeeNumber, emp.Name, emp.CentreCode
from dbo.tblEmployees emp
where emp.CentreCode = 65 or emp.CentreCode = 11;

#4.2

select COUNT(*)
from dbo.tblEmployees emp
where (emp.CategoryCode = 65 and emp.CentreCode <> 11) or ((emp.CategoryCode <> 65 and emp.CentreCode = 11));
  

#4.3

select emp.EmployeeNumber, emp.Name, emp.CentreCode, emp.CategoryCode
from tblEmployees emp
where emp.CategoryCode = 12 and emp.CentreCode = 4;

#4.4

select emp.EmployeeNumber, emp.Name, emp.CentreCode, emp.CategoryCode
from dbo.tblEmployees emp
where (emp.CategoryCode=12 and emp.CentreCode=4)or (emp.CategoryCode=13 and emp.CentreCode=1);

#4.5

select emp.EmployeeNumber, emp.Name
from dbo.tblEmployees emp
where emp.EmployeeNumber = 6 or emp.EmployeeNumber = 34;

#4.6

select emp.EmployeeNumber,emp.Name
from dbo.tblEmployees emp
where (emp.CategoryCode = 8 and emp.CentreCode <> 32) or ((emp.CategoryCode <> 8 and emp.CentreCode = 32));

#4.7

select emp.EmployeeNumber,emp.Name
from dbo.tblEmployees emp
where (emp.CategoryCode = 38 and emp.CentreCode <> 6) or ((emp.CategoryCode <> 38 and emp.CentreCode = 6));

#4.8

select emp.EmployeeNumber, emp.Name
from dbo.tblEmployees emp
where emp.EmployeeNumber = 12 and emp.AreaCode = 6;

#4.9

select emp.EmployeeNumber, emp.Name
from dbo.tblEmployees emp
where emp.EmployeeNumber = 17 and emp.AreaCode = 8;


#5

select *
from dbo.tblCentreMaster;

#6

select distinct emp.EmployeeType
from dbo.tblEmployees emp;

#7.1

select emp.Name, emp.FatherName, emp.DOB, emp.PresentBasic
from dbo.tblEmployees emp
where emp.PresentBasic > 30000;

#7.2

select emp.Name, emp.FatherName, emp.DOB, emp.PresentBasic
from dbo.tblEmployees emp
where emp.PresentBasic < 30000;

#7.3

select emp.Name, emp.FatherName, emp.DOB, emp.PresentBasic
from dbo.tblEmployees emp
where emp.PresentBasic between 3000 and 5000;

#8.1

select *
from dbo.tblEmployees emp
where emp.Name like '%khan';

#8.2

select *
from dbo.tblEmployees emp
where emp.Name like 'chandra%';

#8.3

select emp.Name 
from dbo.tblEmployees emp
where emp.Name like '[a-t][.]Ramesh';