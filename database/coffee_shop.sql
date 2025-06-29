-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2025 at 11:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coffee_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` enum('Coffee','Tea','Milk') NOT NULL DEFAULT 'Coffee'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `name`, `image_url`, `price`, `category`) VALUES
(1, 'Latte', 'https://www.falconforprofessional.com/wp-content/themes/falconforprofessional/assets/images/recipe/milk_latte_cappuccino_mocha/how_to_2_1.jpg', 60.00, 'Coffee'),
(2, 'Espresso', 'https://aromathailand.com/wp-content/uploads/2024/02/ccc.jpg', 55.00, 'Coffee'),
(3, 'Iced Matcha Latte', 'https://yalamarketplace.com/upload/1658399714294.jpg', 65.00, 'Tea'),
(4, 'Thai Tea (Iced)', 'https://thethaiger.com/th/wp-content/uploads/2023/02/%E0%B8%8A%E0%B8%B2%E0%B9%84%E0%B8%97%E0%B8%A2.png', 55.00, 'Tea'),
(5, 'Iced Matcha Latte', 'https://image.makewebeasy.net/makeweb/m_1920x0/W7OuxZEpB/DefaultData/%E0%B8%8A%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%B8%E0%B8%94%E0%B8%B4%E0%B8%9A_06.jpg?v=202405291424', 60.00, 'Tea');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `title`, `description`, `start_date`, `end_date`, `image_url`, `active`) VALUES
(1, 'โปรโมชั่นลด 10% ทุกเมนู', 'โปรโมชั่นลด 10% เมื่อสั่งซื้อเมนูใดก็ได้ตั้งเเต่วันนี้ - 12 ก.ค. 2025', '2025-06-30', '2025-07-12', 'https://png.pngtree.com/png-clipart/20220913/ourmid/pngtree-discount-for-10-off-sale-with-red-background-png-image_6145578.png', 1),
(2, 'โปรโมชั่นลด 20% ทุกเมนู', 'โปรโมชั่นลด 20% เมื่อสั่งซื้อเมนูใดก็ได้ 2 เเก้วขึ้นไป ตั้งเเต่วันนี้ - 12 ก.ค. 2025', '2025-06-30', '2025-07-12', 'https://e7.pngegg.com/pngimages/631/660/png-clipart-red-encapsulated-postscript-20-off-label-text.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`id`, `name`, `address`, `latitude`, `longitude`) VALUES
(1, 'Satyr Cafe', 'มหาวิทยาลัยนเรศวร คณะวิทยาศาสตร์', 16.7481372, 100.1923091);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `line_id` varchar(100) DEFAULT NULL,
  `points` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `line_id` (`line_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
