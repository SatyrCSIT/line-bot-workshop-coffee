-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2025 at 03:57 PM
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
(1, 'Iced Matcha Latte', 'https://image.makewebeasy.net/makeweb/m_1920x0/W7OuxZEpB/DefaultData/%E0%B8%8A%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%B8%E0%B8%94%E0%B8%B4%E0%B8%9A_06.jpg?v=202405291424', 70.00, 'Tea'),
(2, 'Iced Thai Tea', 'https://aromathailand.com/wp-content/uploads/2024/02/a.jpg', 45.00, 'Tea'),
(3, 'Cappuccino Hot', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Iuebn1gJ7fRrCIlVLMg7doSF-GFbuVsxeA&s', 70.00, 'Coffee'),
(4, 'Iced Fresh Milk', 'https://mabintea.com/wp-content/uploads/2022/11/%E0%B9%80%E0%B8%A1%E0%B8%99%E0%B8%B9%E0%B8%A7%E0%B8%B4%E0%B8%9B%E0%B8%8A%E0%B8%B5%E0%B8%AA%E0%B8%99%E0%B8%A1%E0%B8%AA%E0%B8%94.jpg', 45.00, 'Milk');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `sweetness_level` varchar(50) NOT NULL DEFAULT 'หวานปกติ',
  `total_price` decimal(10,2) NOT NULL,
  `points_used` int(11) DEFAULT 0,
  `status` enum('pending','confirmed','preparing','ready','completed','cancelled') DEFAULT 'pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `menu_id`, `quantity`, `sweetness_level`, `total_price`, `points_used`, `status`, `order_date`) VALUES
(1, 'Ueb4e5a1a2bd497bec1cb4d6f42db944b', 1, 1, 'ปกติ', 70.00, 0, 'pending', '2025-07-01 13:35:01');

-- --------------------------------------------------------

--
-- Table structure for table `point_history`
--

CREATE TABLE `point_history` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `points_earned` int(11) DEFAULT 0,
  `points_used` int(11) DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point_history`
--

INSERT INTO `point_history` (`id`, `user_id`, `order_id`, `points_earned`, `points_used`, `description`, `created_at`) VALUES
(1, 'Ueb4e5a1a2bd497bec1cb4d6f42db944b', 1, 1, 0, 'ได้รับ 1 แต้มจากการสั่งซื้อ Iced Matcha Latte (1 แก้ว)', '2025-07-01 13:35:01');

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
(1, 'โปรโมชั่นลด 10% ทุกเมนู', 'โปรโมชั่นลด 10% ทุกเมนู เมื่อสั่งซื้ออาหาร 2 เมนูขึ้นไป', '2025-07-01', '2025-07-31', 'https://png.pngtree.com/png-clipart/20220913/ourmid/pngtree-discount-for-10-off-sale-with-red-background-png-image_6145578.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`id`, `name`, `address`, `latitude`, `longitude`, `phone`, `opening_hours`) VALUES
(1, 'Satyr Cafe', '123 ถนนนเรศวร ตำบลในเมือง อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก 65000', 16.8219000, 100.2607000, '055-123-456', 'จันทร์-อาทิตย์ 07:00-21:00 น.');

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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `line_id`, `points`) VALUES
(1, 'TONG', 'Ueb4e5a1a2bd497bec1cb4d6f42db944b', 1),
(2, '𝒩𝒶𝓉🐢❤️🐰', 'Uc056ba8360f72ecdf48fbb1eec5ccb3f', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_id` (`menu_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_order_date` (`order_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `point_history`
--
ALTER TABLE `point_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_user_id` (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `point_history`
--
ALTER TABLE `point_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `point_history`
--
ALTER TABLE `point_history`
  ADD CONSTRAINT `point_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
