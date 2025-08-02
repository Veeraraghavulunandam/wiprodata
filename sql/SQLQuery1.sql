use sqlpractice
Go


--Display list of tables avalible in current database

select * from INFORMATION_SCHEMA. TABLES
GO

--DISPLAY INFORMATION ABOUT EMP TABLE 

sp_help Emp
go

select * from EMp
go


--Display Empno,Name,Basic from Emp table

select Empno,nam,basic
  from Emp
  Go


  --Display All records whose basic > 50000

  select * from EMp
  WHERE basic > 50000
  Go