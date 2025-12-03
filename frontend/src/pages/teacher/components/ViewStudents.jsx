import { useState, useEffect } from 'react';
import { teacherAPI } from '../../../utils/api';

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await teacherAPI.getClasses();
            setClasses(response.data);
        } catch (error) {
            console.error('Failed to fetch classes');
        }
        setLoading(false);
    };

    const fetchStudents = async () => {
        if (!selectedClass || !selectedSection) return;
        
        setLoading(true);
        try {
            const response = await teacherAPI.getStudents(selectedClass, selectedSection);
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents();
        }
    }, [selectedClass, selectedSection]);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const uniqueClasses = [...new Set(classes.map(c => c.className))];
    const uniqueSections = selectedClass ? 
        [...new Set(classes.filter(c => c.className === selectedClass).map(c => c.section))] : [];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">View Students</h3>
                    <p className="text-gray-600 text-sm">View students from your assigned classes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                    value={selectedClass}
                    onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedSection('');
                        setStudents([]);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select Class</option>
                    {uniqueClasses.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                </select>
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    disabled={!selectedClass}
                >
                    <option value="">Select Section</option>
                    {uniqueSections.map(section => (
                        <option key={section} value={section}>Section {section}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    disabled={!selectedClass || !selectedSection}
                />
            </div>

            <div className="bg-white border border-gray-300 rounded overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">Loading students...</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No students found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-red-600 text-white">
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Name</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Class</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Email</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Gender</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Parent Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{student.name}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{student.rollNo}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{student.class}-{student.section}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{student.email}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{student.gender}</td>
                                        <td className="border border-gray-300 px-4 py-3 text-sm">{student.fatherPhone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewStudents;