USE [master]
GO
/****** Object:  Database [cms]    Script Date: 16-08-2025 11:15:13 ******/
CREATE DATABASE [cms]
GO
CREATE TABLE [dbo].[Customer](
	[custId] [int] NOT NULL,
	[custName] [varchar](30) NULL,
	[custUserName] [varchar](30) NULL,
	[custPassword] [varchar](30) NULL,
	[city] [varchar](30) NULL,
	[state] [varchar](30) NULL,
	[email] [varchar](30) NULL,
	[mobileNo] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[custId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Menu]    Script Date: 16-08-2025 11:15:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Menu](
	[menuId] [int] IDENTITY(1,1) NOT NULL,
	[ItemName] [varchar](30) NULL,
	[ItemType] [varchar](20) NULL,
	[Price] [numeric](9, 2) NULL,
	[Description] [varchar](30) NULL,
	[rating] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[menuId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 16-08-2025 11:15:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[OrderId] [int] IDENTITY(1,1) NOT NULL,
	[custId] [int] NULL,
	[MenuId] [int] NULL,
	[VendorId] [int] NULL,
	[QtyOrd] [int] NULL,
	[BillAmount] [numeric](9, 2) NULL,
	[OrderStatus] [varchar](30) NULL,
	[OrderComments] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vendor]    Script Date: 16-08-2025 11:15:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vendor](
	[VendorId] [int] IDENTITY(1,1) NOT NULL,
	[VendorName] [varchar](30) NULL,
	[VendorUserName] [varchar](30) NULL,
	[VendorPassword] [varchar](30) NULL,
	[VendorEmail] [varchar](30) NULL,
	[VendorMobile] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[VendorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wallet]    Script Date: 16-08-2025 11:15:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wallet](
	[walletId] [int] IDENTITY(1,1) NOT NULL,
	[custId] [int] NULL,
	[walletType] [varchar](30) NULL,
	[walletAmount] [numeric](9, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[walletId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Vendor__827BE18784A1828A]    Script Date: 16-08-2025 11:15:14 ******/
ALTER TABLE [dbo].[Vendor] ADD UNIQUE NONCLUSTERED 
(
	[VendorUserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('PENDING') FOR [OrderStatus]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([custId])
REFERENCES [dbo].[Customer] ([custId])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([MenuId])
REFERENCES [dbo].[Menu] ([menuId])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([VendorId])
REFERENCES [dbo].[Vendor] ([VendorId])
GO
USE [master]
GO
ALTER DATABASE [cms] SET  READ_WRITE 
GO