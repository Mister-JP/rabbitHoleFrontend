'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';


const fetchCategories = async (genre) => {
    const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments");
    const data = await response.json();
    setDepartments(data.departments);
  };
  

  const Categories = () => {
    const [departments, setDepartments] = useState([]);
  
    useEffect(() => {
      fetchCategories(setDepartments);
    }, []);
  
    return (
      <div className="grid grid-cols-2 gap-4">
        {departments.map((department) => (
          <Link href={`/department/${department.departmentId}`}>
          
            <div
              key={department.departmentId}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              <img
                src={`/Categories/${department.departmentId}.jpg`}
                alt={department.displayName}
                className="w-full h-48 object-cover rounded hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-xl mt-5 font-semibold">{department.displayName}</h3>
            </div>
          
        </Link>
        ))}
      </div>
    );
  };
  
  export default Categories;
  