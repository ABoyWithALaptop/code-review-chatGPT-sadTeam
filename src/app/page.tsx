"use client";
import { getDiff, getPulls, pull } from "@/api/github";
import Image from "next/image";
import { useState } from "react";
import SelectRepo from "@/components/SelectRepo";
import ListPR from "@/components/ListPR";

export default function Home() {
	return (
		<ListPR />
	)
}