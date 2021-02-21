import express from 'express';
import { School } from '../types/school';

const router = express.Router();

const data: School[] = [
    {
        id: 1,
        name: 'Seoul National University',
    },
    {
        id: 2,
        name: 'Massachusetts Institute of Technology',
    },
];

router.get('/', (req, res) => {
    const { name } = req.query;
    const result = [];
    if (name) {
        const filtered = data.filter((school: School) => school.name === name);
        result.push(...filtered);
    } else {
        result.push(...data);
    }
    return res.status(200).json(result);
});

router.get('/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    if (!schoolId) {
        return res.status(400).json();
    }

    const schoolIdNumber: number = parseInt(schoolId, 10);
    if (!data.some(({ id }) => id === schoolIdNumber)) {
        return res.status(404).json();
    }

    const filtered = data.filter((item: School) => item.id === schoolIdNumber);
    return res.status(200).json(filtered[0]);
});

router.post('/', (req, res) => {
    const school: School = req.body as School;
    if (!school) {
        return res.status(400).json();
    }

    if (Array.isArray(data) && data.length === 0) {
        school.id = 1;
    } else {
        let id: number = Math.max.apply(Math, data.map(function (target) {
            return target.id;
        }));
        school.id = id + 1;
        /*let id: number = Math.max(...data.map((item: School) => item.id)) + 1;
        school.id = id;*/
    }

    data.push(school);
    return res.status(201).json();
});

router.put('/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    if (!schoolId) {
        return res.status(400).json();
    }

    const schoolIdNumber: number = parseInt(schoolId, 10);
    if (!data.some(({ id }) => id === schoolIdNumber)) {
        return res.status(404).json();
    }

    const school: School = req.body as School;
    if (school.id !== schoolIdNumber) {
        return res.status(400).json();
    }

    const idx: number = data.findIndex((existSchool: School) => existSchool.id === schoolIdNumber);
    data[idx] = school;
    return res.status(200).json();
});

router.delete('/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    if (!schoolId) {
        return res.status(400).json();
    }

    const schoolIdNumber: number = parseInt(schoolId, 10);
    if (!data.some(({ id }) => id === schoolIdNumber)) {
        return res.status(404).json();
    }

    const idx: number = data.findIndex((school: School) => school.id === schoolIdNumber);
    data.splice(idx, 1);
    return res.status(200).json();
});

export default router;